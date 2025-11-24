// components/ui/ExecutionModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { IntentStatus } from '@/hooks/use-intent';
import { PlanResponse } from '@/lib/types';
import { CheckCircle2, Loader, XCircle } from 'lucide-react';

interface ExecutionModalProps {
  isOpen: boolean;
  status: IntentStatus;
  planDetails: PlanResponse['chosen'] | null;
  error: string | null;
}

// A helper component for each step in the modal
const StatusStep = ({ title, isActive, isCompleted }: { title: string; isActive: boolean; isCompleted: boolean; }) => (
  <div className="flex items-center gap-4 text-lg">
    {isActive ? (
      <Loader className="h-6 w-6 text-cyber-cyan animate-spin" />
    ) : isCompleted ? (
      <CheckCircle2 className="h-6 w-6 text-defi-success" />
    ) : (
      <div className="h-6 w-6 border-2 border-gray-600 rounded-full" />
    )}
    <span className={isActive ? 'text-white' : 'text-gray-500'}>{title}</span>
  </div>
);

export function ExecutionModal({ isOpen, status, planDetails, error }: ExecutionModalProps) {
  const steps = [
    { id: 'parsing', title: '1/4: Parsing intent...' },
    { id: 'planning', title: '2/4: Finding best farm on BlockDAG...' },
    { id: 'submitting', title: `3/4: Checking contract with GoPlus Security... ${planDetails ? `[Score: ${planDetails.safety_score}/100]` : ''}` },
    { id: 'polling', title: '4/4: Executing on BlockDAG Testnet...' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-space-800/80 border-glass-stroke backdrop-blur-md text-white font-body">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-cyber-cyan">Execution in Progress</DialogTitle>
          <DialogDescription className="text-gray-400">
            Your intent is being processed securely on-chain. Please wait.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-6">
          {steps.map((step, index) => (
            <StatusStep 
              key={step.id}
              title={step.title}
              isActive={status === step.id}
              isCompleted={index < currentStepIndex}
            />
          ))}
        </div>
        {status === 'error' && (
           <div className="flex items-center gap-4 p-4 bg-red-900/50 border border-defi-error rounded-lg">
             <XCircle className="h-6 w-6 text-defi-error" />
             <p className="text-white">{error || 'An unknown error occurred.'}</p>
           </div>
        )}
      </DialogContent>
    </Dialog>
  );
}