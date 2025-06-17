import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">ENV Store</CardTitle>
          <CardDescription>
            Sync your environment variables across devices securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>
          </form>
          <p className="mt-4 text-xs text-center text-muted-foregrounds">
            By signing in, you agree to sync your environment variables securely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
