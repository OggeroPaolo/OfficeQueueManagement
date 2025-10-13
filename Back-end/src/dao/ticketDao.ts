import { getOne, runQuery } from "../config/database.js";




class TicketDAO {


  //Utility function for ticket code generation
  private sequenceLetters(index: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let letters = '';
    do {
      letters = chars[index % 26] + letters;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    return letters;
  }

  //Utility function for ticket code generation 
  private formatNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  //Utility function for ticket code generation
  private async generateTicketCode(): Promise<string> {
    const countSQL = `
    SELECT COUNT(*) as count
    FROM tickets
    WHERE DATE(created_at) = DATE(?)
  `;
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const result = await getOne<{ count: number }>(countSQL, [today]);
    if (!result) {
      throw new Error('Failed to count tickets created today');
    }
    const count = result.count;
    const letterPart = this.sequenceLetters(Math.floor(count / 100));
    const numberPart = this.formatNumber(count % 100);
    return `TKT-${letterPart}${numberPart}`;
  }

  async getNewTicket(serviceTag: string): Promise<{ id: number; ticket_code: string; service_id: number; status: string }> {
    const getServiceIdSQL = `
      SELECT id FROM services WHERE tag_name = ? LIMIT 1
    `;
    const insertSQL = `
        INSERT INTO tickets (ticket_code, service_id, status)
        VALUES (?, ?, 'waiting')
      `;

    const selectSQL = `
        SELECT id, ticket_code, service_id, status
        FROM tickets
        WHERE ticket_code = ?
        LIMIT 1
      `;



    try {
      const service = await getOne<{ id: number }>(getServiceIdSQL, [serviceTag]);
      if (!service) {
        throw new Error(`Service with tag "${serviceTag}" not found`);
      }

      const ticketCode = await this.generateTicketCode();

      await runQuery(insertSQL, [ticketCode, service.id]);
      const newTicket = await getOne(selectSQL, [ticketCode]);

      if (!newTicket) {
        throw new Error('Failed to retrieve the new ticket after insertion');
      }
      return newTicket;

    } catch (error) {
      throw error;
    }
  }

  private async finalizeCalledTicket(counterId: number): Promise<void> {
    const sql = `
          UPDATE tickets
          SET status = 'served', served_at = CURRENT_TIMESTAMP
          WHERE counter_id = ? AND status = 'called'
        `;
    try {
      await runQuery(sql, [counterId]);
    } catch (error) {
      throw new Error(`Error finalizing called ticket for counter ${counterId}: ${(error as Error).message}`);
    }
  }

  async getNextTicket(counterNumber: string): Promise<{ id: number; ticket_code: string; service_id: number; status: string } | undefined> {
    const getCounterIdSQL = `
          SELECT id FROM counters WHERE counter_number = ? LIMIT 1
        `;

    const updateSQL = `
            WITH service_queues AS (
              SELECT s.id AS service_id, s.service_time, COUNT(t.id) AS queue_length
              FROM services s
              JOIN counter_services cs ON cs.service_id = s.id
              LEFT JOIN tickets t ON t.service_id = s.id AND t.status = 'waiting'
              WHERE cs.counter_id = ?
              GROUP BY s.id, s.service_time
            ),
            max_queue AS (
              SELECT service_id
              FROM service_queues
              WHERE queue_length = (SELECT MAX(queue_length) FROM service_queues)
              ORDER BY service_time ASC
              LIMIT 1
            ),
            next_ticket AS (
              SELECT t.id
              FROM tickets t
              JOIN max_queue mq ON t.service_id = mq.service_id
              WHERE t.status = 'waiting'
              ORDER BY t.created_at ASC
              LIMIT 1
            )
            UPDATE tickets
            SET status = 'called', counter_id = ?, called_at = CURRENT_TIMESTAMP
            WHERE id = (SELECT id FROM next_ticket);
          `;

    const selectSQL = `
            SELECT id, ticket_code, service_id, status, called_at
            FROM tickets
            WHERE counter_id = ? AND status = 'called'
            ORDER BY called_at DESC
            LIMIT 1
          `;

    try {
      const counter = await getOne<{ id: number }>(getCounterIdSQL, [counterNumber]);
      if (!counter) {
        throw new Error(`Counter with number "${counterNumber}" not found`);
      }
      const counterId = counter.id;

      // Finalizza eventuale ticket "called" precedente
      await this.finalizeCalledTicket(counterId);

      await runQuery(updateSQL, [counterId, counterId]);
      const nextTicket = await getOne(selectSQL, [counterId]);
      return nextTicket;

    } catch (error) {
      throw error;
    }
  }



}





export default TicketDAO