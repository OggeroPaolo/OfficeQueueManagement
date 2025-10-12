import { getOne, runQuery } from "../config/database.js";




class TicketDAO {

    async getNewTicket(serviceId: number): Promise<{ id: number; ticket_code: string; service_id: number; status: string }> {
        // Generate a unique code for the ticket
        const ticketCode = `TKT${Date.now()}`;

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

        // Insert and get the new ticket
        try {
            await runQuery(insertSQL, [ticketCode, serviceId]);
            const newTicket = await getOne(selectSQL, [ticketCode]);
            if (!newTicket) {
                throw new Error('Failed to retrieve the new ticket after insertion');
            }
            return newTicket;
        } catch (error) {
            throw error;
        }
    }

}


export default TicketDAO