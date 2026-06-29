import { matchProductAndSpec, matchTwoProductsForComparison } from "./matchingEngine";

export const productMatcher = {
  match: matchProductAndSpec,
  matchComparison: matchTwoProductsForComparison
};
