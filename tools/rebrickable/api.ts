import axios, { AxiosInstance } from "axios";

import {
  PaginatedResponse,
  RebrickableColor,
  RebrickablePart,
  RebrickablePartCategory,
  RebrickablePartColor,
} from "./interfaces";

export type PaginatedRequestOptions = {
  page?: number;
  pageSize?: number;
  ordering?: string;
};

export class RebrickableAPI {
  static create() {
    const apiKey = process.env.REBRICKABLE_API_KEY;
    if (!apiKey) throw new Error(`Missing Rebrickable API key`);
    return new RebrickableAPI(apiKey);
  }

  static readonly baseURL = `https://rebrickable.com/api/v3/lego`;

  private api: AxiosInstance;

  constructor(private apiKey: string) {
    this.api = axios.create({
      baseURL: RebrickableAPI.baseURL,
      headers: {
        Authorization: `key ${this.apiKey}`,
      },
    });
  }

  private createPaginatedQuery(options: PaginatedRequestOptions) {
    const { page, pageSize, ordering } = options;
    const query = new URLSearchParams();
    if (typeof page === "number") query.append("page", String(page));
    if (typeof pageSize === "number") query.append("page_size", String(pageSize));
    if (typeof ordering === "string") query.append("ordering", ordering);
    return query;
  }

  private async retry<T>(
    promise: () => Promise<T>,
    options: { attemptLimit?: number; delay?: number } = {}
  ) {
    const { attemptLimit = 10, delay = 1111 } = options;
    let attempts = 0;
    while (attempts < attemptLimit) {
      attempts++;
      try {
        if (attempts !== 1) console.log(`Retrying (${attempts})...`);
        return await promise();
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error(`Failed after ${attempts} attempts`);
  }

  async getAllPages<T>(
    request: (options: PaginatedRequestOptions) => Promise<PaginatedResponse<T>>,
    pageSize: number = 1000
  ): Promise<T[]> {
    request = request.bind(this);
    let data: T[] = [];
    let response: PaginatedResponse<T>;
    let page = 1;
    let count: number | null = null;
    let pages: number | null = null;

    do {
      response = await request({ page, pageSize });

      if (!count) count = response.count;
      if (!pageSize) pageSize = response.results.length;
      if (!pages) pages = Math.max(1, Math.ceil(count / pageSize));

      data = data.concat(response.results);

      if (count && pageSize) console.log("Fetched page", page, "of", pages);

      page++;
    } while (response.next);
    return data;
  }

  async colors(
    options: PaginatedRequestOptions = {}
  ): Promise<PaginatedResponse<RebrickableColor>> {
    const url = `/colors?${this.createPaginatedQuery(options).toString()}`;
    const res = await this.api.get<PaginatedResponse<RebrickableColor>>(url);
    return res.data;
  }

  async partCategories(options: PaginatedRequestOptions = {}) {
    const url = `/part_categories?${this.createPaginatedQuery(options).toString()}`;
    const res = await this.api.get<PaginatedResponse<RebrickablePartCategory>>(url);
    return res.data;
  }

  async parts(
    options: PaginatedRequestOptions & {
      partId?: string;
      partIds?: string[];
      categoryId?: string;
      colorId?: string;
      bricklinkId?: string;
      brickowlId?: string;
      legoId?: string;
      ldrawId?: string;
      search?: string;
    } = {}
  ) {
    const {
      partId,
      partIds = [],
      categoryId,
      colorId,
      bricklinkId,
      brickowlId,
      legoId,
      ldrawId,
      search,
    } = options;

    const query = this.createPaginatedQuery(options);
    if (typeof partId === "string") query.append("part_num", partId);
    if (partIds.length > 0) query.append("part_nums", partIds.join(","));
    if (typeof categoryId === "string") query.append("part_cat_id", categoryId);
    if (typeof colorId === "string") query.append("color_id", colorId);
    if (typeof bricklinkId === "string") query.append("bricklink_id", bricklinkId);
    if (typeof brickowlId === "string") query.append("brickowl_id", brickowlId);
    if (typeof legoId === "string") query.append("lego_id", legoId);
    if (typeof ldrawId === "string") query.append("ldraw_id", ldrawId);
    if (typeof search === "string") query.append("search", search);

    const url = `/parts?${query.toString()}`;
    const res = await this.retry(() =>
      this.api.get<PaginatedResponse<RebrickablePart>>(url)
    );
    return res.data;
  }

  async partColors(partNum: string, options: PaginatedRequestOptions = {}) {
    const query = this.createPaginatedQuery(options);
    const url = `parts/${partNum}/colors?${query.toString()}`;
    const res = await this.retry(() =>
      this.api.get<PaginatedResponse<RebrickablePartColor>>(url)
    );
    return res.data;
  }
}
