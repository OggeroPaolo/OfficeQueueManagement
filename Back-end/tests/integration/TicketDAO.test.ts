import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TicketDAO from "../../src/dao/ticketDao.js";
import * as db from "../../src/config/database.js";

describe("TicketDAO Integration Test Suit", () => {
  const dao = new TicketDAO();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ------------------------------
  // Utility functions
  // ------------------------------
  describe("Utility functions", () => {
    it("sequenceLetters generates correct letter sequences", () => {
      // @ts-ignore to access private method
      const seq = dao.sequenceLetters;

      expect(seq.call(dao, 0)).toBe("A");
      expect(seq.call(dao, 25)).toBe("Z");
      expect(seq.call(dao, 26)).toBe("AA");
      expect(seq.call(dao, 27)).toBe("AB");
      expect(seq.call(dao, 51)).toBe("AZ");
      expect(seq.call(dao, 52)).toBe("BA");
    });

    it("formatNumber pads numbers correctly", () => {
      // @ts-ignore
      const fmt = dao.formatNumber;

      expect(fmt.call(dao, 0)).toBe("00");
      expect(fmt.call(dao, 5)).toBe("05");
      expect(fmt.call(dao, 10)).toBe("10");
      expect(fmt.call(dao, 99)).toBe("99");
      expect(fmt.call(dao, 123)).toBe("123");
    });

    it("generateTicketCode returns correctly formatted code", async () => {
      vi.spyOn(db, "getOne").mockResolvedValue({ count: 0 }); // mock ticket count

      // @ts-ignore
      const code = await dao.generateTicketCode.call(dao);

      expect(code).toMatch(/^TKT-[A-Z]+[0-9]{2}$/);
    });
  });

  // ------------------------------
  // getNewTicket
  // ------------------------------
  describe("getNewTicket", () => {
    it("creates a new ticket successfully", async () => {
      vi.spyOn(db, "getOne")
        .mockResolvedValueOnce({ id: 1 })    // service found
        .mockResolvedValueOnce({ count: 0 }) // generateTicketCode
        .mockResolvedValueOnce({
          id: 101,
          ticket_code: "TKT-AA00",
          service_id: 1,
          status: "waiting",
        }); // ticket retrieval

      vi.spyOn(db, "runQuery").mockResolvedValue(undefined);

      const result = await dao.getNewTicket("Shipping");

      expect(result).toEqual({
        id: 101,
        ticket_code: "TKT-AA00",
        service_id: 1,
        status: "waiting",
      });

      expect(db.getOne).toHaveBeenCalledTimes(3); // service + count + ticket
      expect(db.runQuery).toHaveBeenCalledTimes(1); // insert
    });

    it("throws an error if service tag not found", async () => {
      vi.spyOn(db, "getOne")
        .mockResolvedValueOnce(null); // service not found

      await expect(dao.getNewTicket("INVALID")).rejects.toThrow(
        'Service with tag "INVALID" not found'
      );
    });

    it("throws an error if ticket retrieval fails after insert", async () => {
      vi.spyOn(db, "getOne")
        .mockResolvedValueOnce({ id: 1 })    // service found
        .mockResolvedValueOnce({ count: 0 }) // generateTicketCode
        .mockResolvedValueOnce(null);        // ticket retrieval fails

      vi.spyOn(db, "runQuery").mockResolvedValue(undefined);

      await expect(dao.getNewTicket("Shipping")).rejects.toThrow(
        "Failed to retrieve the new ticket after insertion"
      );
    });
  });

  // ------------------------------
  // getNextTicket
  // ------------------------------
  describe("getNextTicket", () => {
    it("calls the next waiting ticket successfully", async () => {
      const counter = { id: 1 };
      const nextTicket = {
        id: 201,
        ticket_code: "TKT-BB01",
        service_id: 2,
        status: "called",
        called_at: "2025-01-01 10:00:00",
      };

      vi.spyOn(db, "getOne")
        .mockResolvedValueOnce(counter)     // counter exists
        .mockResolvedValueOnce(nextTicket); // select called ticket

      vi.spyOn(db, "runQuery").mockResolvedValue(undefined); // finalize + update

      const result = await dao.getNextTicket("C1");

      expect(result).toEqual(nextTicket);
      expect(db.getOne).toHaveBeenCalledTimes(2);
      expect(db.runQuery).toHaveBeenCalledTimes(2);
    });

    it("throws an error if counter does not exist", async () => {
      vi.spyOn(db, "getOne").mockResolvedValueOnce(null);

      await expect(dao.getNextTicket("NON_EXISTENT")).rejects.toThrow(
        'Counter with number "NON_EXISTENT" not found'
      );
    });

    it("finalizes previous called ticket before calling next ticket", async () => {
      const counter = { id: 1 };
      const nextTicket = { id: 202, ticket_code: "TKT-CC01", service_id: 2, status: "called" };

      vi.spyOn(db, "getOne")
        .mockResolvedValueOnce(counter)     // counter exists
        .mockResolvedValueOnce(nextTicket); // next ticket

      const runQueryMock = vi.spyOn(db, "runQuery").mockResolvedValue(undefined);

      const result = await dao.getNextTicket("C1");
      expect(result).toEqual(nextTicket);

      // First runQuery: finalize previous ticket
      expect(runQueryMock).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE tickets"),
        [1]
      );

      // Second runQuery: update next ticket
      expect(runQueryMock).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE tickets"),
        [1, 1]
      );
    });

  });
});
