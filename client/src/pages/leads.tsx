import { LeadsTable } from "@/components/leads/leads-table";

export default function Leads() {
  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-fuchsia">Lead</span>{" "}
          <span className="text-white">Management</span>
        </h2>

        <LeadsTable />
      </div>
    </div>
  );
}
