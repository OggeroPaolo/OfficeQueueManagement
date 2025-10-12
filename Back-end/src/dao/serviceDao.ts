import { getAll } from "../config/database.js"


export default class ServiceDao {
  async getAllServices(): Promise<string[]> {
    const query = "SELECT * FROM Services";

    const rows = await getAll(query); 

    return this.mapRowsToServiceList(rows);
  }

  private mapRowsToServiceList(rows: any[]): string[] {
    return rows.map(row => row.tag_name);
  }
}
