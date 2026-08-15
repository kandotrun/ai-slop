import { FORM_FEATURE_NAME } from "../shared/form-feature";

interface FeatureNameProps {
  className?: string;
}

export function FeatureName({ className = "" }: FeatureNameProps) {
  return <span className={`giga-brand ${className}`.trim()}>{FORM_FEATURE_NAME}</span>;
}
