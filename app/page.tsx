import SearchInterface from './components/SearchInterface';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Software Engineer Search</h1>
      <SearchInterface />
    </main>
  );
}
