import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { fetchCardData } from '@/app/lib/data'; // remove fetchLatestInvoices
import { LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  // [streaming-latestinvoices](Step 2) remove the data fetch in the dashboard page 
  // const latestInvoices = await fetchLatestInvoices();

  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPendingInvoices,
    totalPaidInvoices
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
        {/* [streaming-latestinvoices](Step 2)  use the <RevenueChart> component to let it fetch its own data && add loading skeleton */}
        <Suspense fallback={<LatestInvoicesSkeleton/>}>
        <LatestInvoices />
        </Suspense>

      </div>
    </main>
  );
}