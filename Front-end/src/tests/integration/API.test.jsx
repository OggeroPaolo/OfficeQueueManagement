import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getServices, getNewTicket, getNextTicket } from "../../API/API";

const URI = "http://localhost:3000";

describe("API module", () => {
  beforeEach(() => {
    // mock global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ✅ getServices tests
  test("getServices() returns list of services when response is OK", async () => {
    const mockServices = [
        { id: 1, tag_name: "Shipping" },
        { id: 2, tag_name: "Billing" },
        { id: 3, tag_name: "Support" },
      ];
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices,
    });

    const result = await getServices();
    expect(result).toEqual(mockServices);
    expect(global.fetch).toHaveBeenCalledWith(`${URI}/services`);
  });

  test("getServices() throws error when response is not OK", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(getServices()).rejects.toThrow("Failed to fetch services");
  });

  // ✅ getNewTicket tests
  test("getNewTicket() returns ticket code when success", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ticket_code: "A001" }),
    });

    const result = await getNewTicket("A");
    expect(result).toBe("A001");
    expect(global.fetch).toHaveBeenCalledWith(`${URI}/tickets/new`, expect.any(Object));
  });

  test("getNewTicket() throws error when response is not OK", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(getNewTicket("A")).rejects.toThrow("Failed to create new ticket");
  });

  // ✅ getNextTicket tests
  test("getNextTicket() returns ticket code when success", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ticket_code: "B001" }),
    });

    const result = await getNextTicket(1);
    expect(result).toBe("B001");
    expect(global.fetch).toHaveBeenCalledWith(`${URI}/tickets/next`, expect.any(Object));
  });

  test("getNextTicket() throws error when response is not OK", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(getNextTicket(1)).rejects.toThrow("Failed to create new ticket");
  });
});
