import { Heading1, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "./ui/button";

interface ControlsBarProps {
  onFormatChange: (format: string) => void;
}

const ControlsBar = ({ onFormatChange }: ControlsBarProps) => {
  return (
    <div className="flex gap-2 p-3 bg-card border border-border rounded-lg shadow-sm">
      <Button
        onClick={() => onFormatChange('heading')}
        variant="outline"
        size="sm"
        className="btn-3d"
        title="Convert to heading"
        aria-label="Format as heading"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      
      <div className="h-6 w-px bg-border mx-1" />
      
      <Button
        onClick={() => onFormatChange('left')}
        variant="outline"
        size="sm"
        className="btn-3d"
        title="Align left"
        aria-label="Align text left"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={() => onFormatChange('center')}
        variant="outline"
        size="sm"
        className="btn-3d"
        title="Align center"
        aria-label="Align text center"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={() => onFormatChange('right')}
        variant="outline"
        size="sm"
        className="btn-3d"
        title="Align right"
        aria-label="Align text right"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ControlsBar;
