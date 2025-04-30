
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { School2, LogIn } from "lucide-react";

const NotAuthenticated = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-scholar-600 flex items-center justify-center">
            <School2 className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">Authentication Required</h1>
        
        <p className="text-xl text-muted-foreground">
          Please sign in to access the ScholarPay Dashboard
        </p>
        
        <Button 
          onClick={() => navigate("/sign-in")}
          className="gap-2"
          size="lg"
        >
          <LogIn className="h-4 w-4" />
          Sign In Now
        </Button>
      </div>
    </div>
  );
};

export default NotAuthenticated;
