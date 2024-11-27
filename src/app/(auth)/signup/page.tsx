import AuthForm from "@/components/AuthPages/AuthForm";

const page = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      {/*SignUp page */}
      <div className="  shadow-md">
        <AuthForm type="signup" />
      </div>
    </section>
  );
};

export default page;
