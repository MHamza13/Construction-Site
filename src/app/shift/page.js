import AllShifts from "@/components/AllShifts";
import Banner from "@/components/layout/Banner";

const ShiftPage = () => {
  return (
    <>
      <Banner
        title="Shift"
        subtitle="Overview & insights of your projects"
        breadcrumb={[{ label: "Home", href: "/dashboard" }, { label: "Shift" }]}
      />
      <div className="mt-4">
        <AllShifts />
      </div>
    </>
  );
};

export default ShiftPage;
