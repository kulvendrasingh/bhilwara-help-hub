
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/PageLayout";

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="container mx-auto py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Bhilwara Help Hub</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">
              Bhilwara Help Hub is a community-driven platform dedicated to solving local problems in Bhilwara city. 
              Our mission is to connect citizens, local authorities, and volunteers to address civic issues efficiently.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Mission</h2>
            <p>
              We believe in the power of community collaboration to solve problems. By providing a platform where 
              citizens can report issues, experts can offer solutions, and authorities can respond, we aim to create a 
              more responsive and efficient system for addressing civic concerns.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-3 mb-6">
              <li>
                <strong>Report Issues:</strong> Citizens can post problems they're facing in their locality, whether it's water supply issues, 
                road conditions, electricity problems, or any other civic concern.
              </li>
              <li>
                <strong>Community Solutions:</strong> Other community members, including subject matter experts and local authorities, 
                can suggest solutions or provide information about the reported issues.
              </li>
              <li>
                <strong>Track Progress:</strong> Issues can be tracked from reporting to resolution, creating accountability and transparency.
              </li>
              <li>
                <strong>Knowledge Repository:</strong> Over time, the platform becomes a valuable knowledge base for common issues and their solutions.
              </li>
            </ol>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Join Our Community</h2>
            <p className="mb-6">
              Whether you're a resident facing problems, a professional with expertise to share, or a local official looking to engage with citizens, 
              Bhilwara Help Hub welcomes your participation. Together, we can make Bhilwara a better place to live.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => window.location.href = "/register"}>
                Create an Account
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = "/problems"}>
                Browse Problems
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
