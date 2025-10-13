import { describe, it, expect, vi, beforeEach } from "vitest";
import ServiceDao from "../../src/dao/serviceDao.js";
import * as db from "../../src/config/database.js";

describe("ServiceDao", () => {
  let dao: ServiceDao;

  beforeEach(() => {
    dao = new ServiceDao();
    vi.restoreAllMocks();
  });

  describe("getAllServices", () => {
    it("returns a list of service tags", async () => {
      const mockRows = [
        { id: 1, tag_name: "Shipping" },
        { id: 2, tag_name: "Billing" },
        { id: 3, tag_name: "Support" },
      ];

      vi.spyOn(db, "getAll").mockResolvedValue(mockRows);

      const result = await dao.getAllServices();

      expect(result).toEqual(["Shipping", "Billing", "Support"]);
      expect(db.getAll).toHaveBeenCalledWith("SELECT * FROM Services");
    });

    it("returns an empty array if no services found", async () => {
      vi.spyOn(db, "getAll").mockResolvedValue([]);

      const result = await dao.getAllServices();

      expect(result).toEqual([]);
    });
  });

  describe("mapRowsToServiceList (private)", () => {
    it("maps rows to service tag names", () => {
      const rows = [
        { id: 1, tag_name: "A" },
        { id: 2, tag_name: "B" },
      ];

      // @ts-ignore to access private method
      const result = dao.mapRowsToServiceList(rows);

      expect(result).toEqual(["A", "B"]);
    });
  });
});
