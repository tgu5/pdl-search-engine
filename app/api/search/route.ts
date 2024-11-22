// app/api/search/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function parseYearRange(yearRange: string): { lower: number; upper: number } {
  if (yearRange === '') {
    return {lower: 0, upper: 99}
  }
  
  if (yearRange.endsWith('+')) {
    const lower = parseInt(yearRange.replace('+', ''));
    return { lower, upper: 99 }; // Set an arbitrarily high upper bound
  }
  const [lower, upper] = yearRange.split('-').map(num => parseInt(num));
  return { lower, upper };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { yearsExperience, companies, skills, salaryRange } = body;
  console.log(body)

  let query = { where: {} }

  if (!!yearsExperience) {
    const { lower, upper } = parseYearRange(yearsExperience);
    query.where = {
        inferred_years_experience: {
            // Convert the stored string to number for comparison
            in: Array.from({ length: upper - lower + 1 }, (_, i) => String(lower + i))
          },
    }
  }

  let andCondition = []
  let orCompanies = []
  let orSkills = []

  let _companies = companies.filter((c:any) => !!c);
  if (_companies.length > 0) {
    orCompanies.push(..._companies.map((company: any) => ({
                companies_worked_at: {
                  contains: company
                }})))
  }

  let _skills = skills.filter((c:any) => !!c);
  if (_skills.length > 0) {
    orSkills.push(..._skills.map((skill: any) => ({
        skills: {
          contains: skill
        }})))
  }

  if (orCompanies.length > 0 && orSkills.length > 0) {
    andCondition.push({ OR: orCompanies }, { OR: orSkills })
    query.where = {
        ...query.where,
        AND: andCondition,
    }
  } else if (orCompanies.length > 0 && orSkills.length == 0) {
    query.where = {
        ...query.where,
        OR: orCompanies,
    }
  } else if (orCompanies.length == 0 && orSkills.length > 0) {
    query.where = {
        ...query.where,
        OR: orSkills,
    }
  }
 
  const results = await prisma.engineer.findMany(query
//     {
//     where: {
//       inferred_salary: {
//         TO BE IMPLEMENTED
//       }
//     }
//   }
);

  return NextResponse.json(results);
}