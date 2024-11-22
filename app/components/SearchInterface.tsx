// app/components/SearchInterface.tsx
"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Engineer {
  name: string;
  inferred_years_experience: string;
  companies_worked_at: string;
  skills: string;
  inferred_salary: string;
  recommended_personal_email: string;
}

export default function SearchInterface() {
  const [results, setResults] = useState<Engineer[]>([]);
  const [yearsExperience, setYearsExperience] = useState('');
  const [company1, setCompany1] = useState('');
  const [company2, setCompany2] = useState('');
  const [skill1, setSkill1] = useState('');
  const [skill2, setSkill2] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const yearsOptions = ['0-2', '3-5', '5-10', '10-15', '15-20', '20+'];
  const companiesOptions = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'];
  const skillsOptions = ['React', 'Python', 'Java', 'Node.js', 'AWS'];
  const salaryRanges = ['100k-150k', '150k-200k', '200k-250k', '250k+'];

  const handleSearch = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        yearsExperience,
        companies: [company1.toLowerCase(), company2.toLowerCase()],
        skills: [skill1.toLowerCase(), skill2.toLowerCase()],
        salaryRange
      })
    });

    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <p className="text-lg">
          I'm looking for Software Engineers in New York who have
          <Select onValueChange={setYearsExperience}>
            <SelectTrigger className="w-32 mx-2 inline-block">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              {yearsOptions.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          years of experience, worked at any of these companies:
          <Select onValueChange={setCompany1}>
            <SelectTrigger className="w-32 mx-2 inline-block">
              <SelectValue placeholder="Company 1" />
            </SelectTrigger>
            <SelectContent>
              {companiesOptions.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          ,
          <Select onValueChange={setCompany2}>
            <SelectTrigger className="w-32 mx-2 inline-block">
              <SelectValue placeholder="Company 2" />
            </SelectTrigger>
            <SelectContent>
              {companiesOptions.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          , have the following skills:
          <Select onValueChange={setSkill1}>
            <SelectTrigger className="w-32 mx-2 inline-block">
              <SelectValue placeholder="Skill 1" />
            </SelectTrigger>
            <SelectContent>
              {skillsOptions.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          ,
          <Select onValueChange={setSkill2}>
            <SelectTrigger className="w-32 mx-2 inline-block">
              <SelectValue placeholder="Skill 2" />
            </SelectTrigger>
            <SelectContent>
              {skillsOptions.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          , and are looking for a salary range
          <Select onValueChange={setSalaryRange}>
            <SelectTrigger className="w-36 mx-2 inline-block">
              <SelectValue placeholder="Salary range" />
            </SelectTrigger>
            <SelectContent>
              {salaryRanges.map(range => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </p>
        
        <Button 
          className="w-full md:w-auto"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {results.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Years Experience</TableHead>
              <TableHead>Companies</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
            <TableRow key={index}>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.inferred_years_experience}</TableCell>
                <TableCell>{JSON.parse(result.companies_worked_at).join(', ')}</TableCell>
                <TableCell>{JSON.parse(result.skills).join(', ')}</TableCell>
                <TableCell>{result.inferred_salary}</TableCell>
                <TableCell>
                <div className="flex items-center gap-2">
                    <span>{result.recommended_personal_email}</span>
                    <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                        console.log(`Send email to ${result.recommended_personal_email}`);
                    }}
                    >
                    Send email
                    </Button>
                </div>
                </TableCell>
            </TableRow>
            ))}
            </TableBody>
        </Table>
      )}
    </div>
  );
}
