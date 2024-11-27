import { TeamMember } from "@/components/TeamMember";
import Layout from "@/components/Layout";
const teamMembers = [
  {
    name: "Mohammed Baqer",
    image: "/Mohammed.png",
  },
  {
    name: "Hamad Alhajeri",
    image: "/Hamad.png",
  },
  {
    name: "Salem AlMutairi",
    image: "/Salem.png",
  },
  {
    name: "Osama Albader",
    image: "/Osama.png",
  },
];

export default function TeamPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            Our Team
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMember
                key={member.name}
                name={member.name}
                image={member.image}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
