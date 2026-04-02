import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { CustomerTables } from '../components/CustomerTables';
import { RiskChart } from '../components/RiskChart';
import { Footer } from '../components/Footer';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Transaction Ingestion & Scoring
          </h1>
          <p className="text-gray-600">
            Ingests transactions, runs rules/behavioural checks, and scores risk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerTables searchQuery={searchQuery} />
          </div>
          <div className="lg:col-span-1">
            <RiskChart />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
