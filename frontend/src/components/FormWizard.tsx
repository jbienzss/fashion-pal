'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface FormWizardProps {
  steps: Step[];
  onComplete?: (formData: any) => void;
}

const FormWizard: React.FC<FormWizardProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = (stepIndex: number) => {
    // Only allow going to completed steps or the current step
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
      // If jumping back, remove completion status from all steps after the target step
      if (stepIndex < currentStep) {
        const newCompletedSteps = new Set<number>();
        for (let i = 0; i < stepIndex; i++) {
          if (completedSteps.has(i)) {
            newCompletedSteps.add(i);
          }
        }
        setCompletedSteps(newCompletedSteps);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepCompleted = (stepIndex: number) => completedSteps.has(stepIndex);
  const isStepAccessible = (stepIndex: number) => stepIndex <= currentStep;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center justify-center space-x-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(index)}
                disabled={!isStepAccessible(index)}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-200
                  ${isStepCompleted(index)
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : index === currentStep
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : isStepAccessible(index)
                    ? 'bg-orange-600/20 text-orange-300 hover:bg-orange-600/30 hover:text-orange-200 border border-orange-700/50'
                    : 'bg-dark-700 text-dark-400 cursor-not-allowed border border-dark-600'
                  }
                `}
              >
                {isStepCompleted(index) ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${isStepCompleted(index) ? 'bg-orange-500' : 'bg-orange-600/30'}`} />
              )}
            </div>
          ))}
        </nav>
        
        {/* Step Title and Description */}
        <div className="text-center mt-3">
          <h2 className="text-xl font-bold text-dark-100">{steps[currentStep].title}</h2>
          <p className="text-sm text-dark-300 mt-1">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Form Content with Animation */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-[300px]"
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${currentStep === 0
              ? 'bg-dark-700 text-dark-400 cursor-not-allowed border border-dark-600'
              : 'bg-orange-600/20 text-orange-200 hover:bg-orange-600/30 hover:text-orange-100 border border-orange-700/50'
            }
          `}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentStep
                  ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
                  : isStepCompleted(index)
                  ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
                  : 'bg-orange-600/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${currentStep === steps.length - 1
              ? 'bg-dark-700 text-dark-400 cursor-not-allowed border border-dark-600'
              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40'
            }
          `}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default FormWizard;
