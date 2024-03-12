import { Button} from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import "../app/globals.css";

export default function About() {
    return(
        <div className="flex items-center gap-4 mt-4">
        <Progress className="flex-1" value={25} />
        <Button>Next</Button>
    </div>
    )
  }