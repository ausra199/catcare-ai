"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { AssessmentResultView } from "@/components/assessment-result-view";
import { repository } from "@/lib/storage";
import type { AssessmentResult, Cat } from "@/lib/types";

export default function AssessmentResultPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = React.useState<{ cat: Cat; result: AssessmentResult } | null | undefined>(undefined);

  React.useEffect(() => {
    const result = repository.getAssessment(params.id);
    if (!result) {
      setData(null);
      return;
    }
    const cat = repository.getCat(result.catId);
    if (!cat) {
      setData(null);
      return;
    }
    setData({ cat, result });
  }, [params.id]);

  if (data === undefined) return null;
  if (data === null) {
    return <p className="text-sm text-muted-foreground">Įvertinimas nerastas.</p>;
  }

  return <AssessmentResultView cat={data.cat} result={data.result} />;
}
