interface Route {
  name: string;
  text: string;
  samples?: string[];
  callback?: (input: string) => void;
}

class Router {
  private routes: Route[];
  encoder: (input: string) => Promise<number[]>;
  constructor(routes: Route[], encoder: (input: string) => Promise<number[]>) {
    this.routes = routes;
    this.encoder = encoder;
  }

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    const dimensionality = Math.max(vec1.length, vec2.length);
    const dotProduct = this.dotProduct(vec1, vec2, dimensionality);
    const magnitude1 = this.magnitude(vec1, dimensionality);
    const magnitude2 = this.magnitude(vec2, dimensionality);

    return dotProduct / (magnitude1 * magnitude2);
  }

  private dotProduct(vec1: number[], vec2: number[], dimensionality: number): number {
    let product = 0;

    for (let i = 0; i < dimensionality; i++) {
      product += (vec1[i] || 0) * (vec2[i] || 0);
    }

    return product;
  }

  private magnitude(vec: number[], dimensionality: number): number {
    let sumOfSquares = 0;

    for (let i = 0; i < dimensionality; i++) {
      sumOfSquares += (vec[i] || 0) ** 2;
    }

    return Math.sqrt(sumOfSquares);
  }

  cacheLayer = {}
  private async generateTokens(text: string): Promise<number[]> {
    // Implement your tokenization logic here
    // This is a placeholder, replace with your actual tokenization logic
    // check cache
    if (this.cacheLayer[text]) {
      return this.cacheLayer[text];
    }
    const res = await this.encoder(text);
    // cache
    this.cacheLayer[text] = res;
    return res;
  }
  private async findMostSimilarRoute(userInputTokens: number[]): Promise<Route | null> {
    // each route has also samples

    let mostSimilarRoute: Route | null = null;
    let mostSimilarScore = 0;

    // check avg sample score + route.text
    for (const route of this.routes) {
      // samples
      let avgScore = 0;
      let samples = route.samples || [];
      for (const sample of samples) {
        const sampleTokens = await this.generateTokens(sample);
        const sampleScore = this.calculateCosineSimilarity(userInputTokens, sampleTokens);
        avgScore += sampleScore;
      }
      avgScore = avgScore / samples.length;
      // route.text
      const routeTokens = await this.generateTokens(route.text);
      const routeScore = this.calculateCosineSimilarity(userInputTokens, routeTokens);
      avgScore += routeScore;
      avgScore = avgScore / 2;

      if (avgScore > mostSimilarScore) {
        mostSimilarRoute = route;
        mostSimilarScore = avgScore;
      }
    }
    return mostSimilarRoute;
  }
  public async routeInput(input: string): Promise<void> {
    const userInputTokens = await this.generateTokens(input);
    const mostSimilarRoute = await this.findMostSimilarRoute(userInputTokens);

    if (mostSimilarRoute && mostSimilarRoute.callback) {
      await mostSimilarRoute.callback(input);
    }
  }
}

export { Router, Route };
