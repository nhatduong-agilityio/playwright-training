// pages/TablePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class TablePage {
  readonly page: Page;
  readonly tableSelector: string;
  readonly headerSelector: string;
  readonly rowSelector: string;
  readonly cellSelector: string;

  constructor(
    page: Page,
    tableSelector: string = 'table.table',
    headerSelector: string = 'thead th',
    rowSelector: string = 'tbody tr',
    cellSelector: string = 'td',
  ) {
    this.page = page;
    this.tableSelector = tableSelector;
    this.headerSelector = headerSelector;
    this.rowSelector = rowSelector;
    this.cellSelector = cellSelector;
  }

  get deleteSelectedButton(): Locator {
    return this.page
      .frameLocator('iframe')
      .getByRole('button', { name: 'Delete selected' });
  }

  get tableLoading(): Locator {
    return this.page.frameLocator('iframe').locator('table.table-loading');
  }

  async waitForTableReady() {
    await expect(this.tableLoading).toHaveCount(0);
  }

  get yesConfirmationButton(): Locator {
    return this.page
      .frameLocator('iframe')
      .locator('.overlay-panel-container')
      .getByRole('button', {
        name: 'Yes',
      });
  }

  /**
   * Get the table element
   */
  get table(): Locator {
    return this.page.frameLocator('iframe').locator(this.tableSelector);
  }

  /**
   * Get all header elements
   */
  get headers(): Locator {
    return this.table.locator(this.headerSelector);
  }

  /**
   * Get all row elements (excluding header)
   */
  get rows(): Locator {
    return this.table.locator(this.rowSelector);
  }

  /**
   * Get header text content as array
   */
  async getHeaderTexts(): Promise<string[]> {
    const headers = await this.headers.allTextContents();
    return headers.map(header => header.trim());
  }

  /**
   * Get header index by column name/text
   */
  async getColumnIndex(columnName: string): Promise<number> {
    const headers = await this.getHeaderTexts();
    const index = headers.findIndex(
      header => header.toLowerCase() === columnName.toLowerCase(),
    );
    if (index === -1) {
      throw new Error(
        `Column "${columnName}" not found in table headers: ${headers.join(', ')}`,
      );
    }
    return index;
  }

  /**
   * Get specific row by index (0-based)
   */
  getRow(rowIndex: number): Locator {
    return this.rows.nth(rowIndex);
  }

  /**
   * Get cell by row and column index
   */
  getCell(rowIndex: number, columnIndex: number): Locator {
    return this.getRow(rowIndex).locator(this.cellSelector).nth(columnIndex);
  }

  /**
   * Get cell by row index and column name
   */
  async getCellByColumnName(
    rowIndex: number,
    columnName: string,
  ): Promise<Locator> {
    const columnIndex = await this.getColumnIndex(columnName);
    return this.getCell(rowIndex, columnIndex);
  }

  /**
   * Get cell text content
   */
  async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.getCell(rowIndex, columnIndex);
    return (await cell.textContent())?.trim() || '';
  }

  /**
   * Get cell text by column name
   */
  async getCellTextByColumnName(
    rowIndex: number,
    columnName: string,
  ): Promise<string> {
    const cell = await this.getCellByColumnName(rowIndex, columnName);

    return (await cell.textContent())?.trim() || '';
  }

  /**
   * Get all data from a specific row as an object
   */
  async getRowData(rowIndex: number): Promise<Record<string, string>> {
    const headers = await this.getHeaderTexts();
    const row = this.getRow(rowIndex);
    const cells = await row.locator(this.cellSelector).allTextContents();

    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (cells[index]) {
        rowData[header] = cells[index].trim();
      }
    });

    return rowData;
  }

  /**
   * Get all table data as array of objects
   */
  async getAllTableData(): Promise<Record<string, string>[]> {
    const rowCount = await this.getRowCount();
    const tableData: Record<string, string>[] = [];

    for (let i = 0; i < rowCount; i++) {
      const rowData = await this.getRowData(i);
      tableData.push(rowData);
    }

    return tableData;
  }

  /**
   * Get total number of rows (excluding header)
   */
  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  /**
   * Get total number of columns
   */
  async getColumnCount(): Promise<number> {
    return await this.headers.count();
  }

  /**
   * Find row index by cell content
   */
  async findRowIndexByCellContent(
    columnName: string,
    searchValue: string,
  ): Promise<number> {
    const rowCount = await this.getRowCount();

    for (let i = 0; i < rowCount; i++) {
      const cellText = await this.getCellTextByColumnName(i, columnName);

      if (cellText.includes(searchValue)) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Find multiple rows by cell content
   */
  async findRowsByCellContent(
    columnName: string,
    searchValue: string,
  ): Promise<number[]> {
    const rowCount = await this.getRowCount();
    const matchingRows: number[] = [];

    for (let i = 0; i < rowCount; i++) {
      const cellText = await this.getCellTextByColumnName(i, columnName);
      if (cellText.includes(searchValue)) {
        matchingRows.push(i);
      }
    }

    return matchingRows;
  }

  /**
   * Click on a specific cell
   */
  async clickCell(rowIndex: number, columnIndex: number): Promise<void> {
    const cell = this.getCell(rowIndex, columnIndex);
    await cell.click();
  }

  /**
   * Click on cell by column name
   */
  async clickCellByColumnName(
    rowIndex: number,
    columnName: string,
  ): Promise<void> {
    const cell = await this.getCellByColumnName(rowIndex, columnName);
    await cell.click();
  }

  /**
   * Click on a row (usually the first clickable element)
   */
  async clickRow(rowIndex: number): Promise<void> {
    const row = this.getRow(rowIndex);
    await row.click();
  }

  /**
   * Check if table contains specific text in any cell
   */
  async containsText(text: string): Promise<boolean> {
    const tableText = await this.table.textContent();
    return tableText?.includes(text) || false;
  }

  /**
   * Wait for table to be loaded (has at least one row)
   */
  async waitForTableToLoad(): Promise<void> {
    await this.table.waitFor({ state: 'visible' });
    await expect(this.rows.first()).toBeVisible();
  }

  /**
   * Get table as a simple 2D array (including headers)
   */
  async getTableAsArray(): Promise<string[][]> {
    const headers = await this.getHeaderTexts();
    const tableData = await this.getAllTableData();

    const result: string[][] = [headers];
    tableData.forEach(row => {
      const rowArray = headers.map(header => row[header] || '');
      result.push(rowArray);
    });

    return result;
  }

  /**
   * Assert that table has expected number of rows
   */
  async assertRowCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getRowCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Assert that table contains specific data in a cell
   */
  async assertCellContent(
    rowIndex: number,
    columnName: string,
    expectedText: string,
  ): Promise<void> {
    const actualText = await this.getCellTextByColumnName(rowIndex, columnName);
    expect(actualText).toContain(expectedText);
  }

  /**
   * Assert that table contains a row with specific data
   */
  async assertRowExists(searchData: Record<string, string>): Promise<void> {
    const tableData = await this.getAllTableData();
    const matchFound = tableData.some(row => {
      return Object.entries(searchData).every(([key, value]) => {
        return row[key]?.includes(value);
      });
    });

    expect(matchFound).toBe(true);
  }

  /**
   * Sort table by clicking on column header (if sortable)
   */
  async sortByColumn(columnName: string): Promise<void> {
    const columnIndex = await this.getColumnIndex(columnName);
    const header = this.headers.nth(columnIndex);
    await header.click();
  }

  /**
   * Sort table by field name (alias for sortByColumn)
   */
  async sortByField(fieldName: string): Promise<void> {
    await this.sortByColumn(fieldName);
  }

  async selectedRow(rowLocator: Locator): Promise<void> {
    await rowLocator.locator('td.bulk-select-col .form-field label').click();
  }

  /**
   * Delete a row by finding it with column value and clicking delete action
   */
  async deleteRowSelected(
    columnName: string,
    searchValue: string,
  ): Promise<void> {
    const rowIndex = await this.findRowIndexByCellContent(
      columnName,
      searchValue,
    );
    const row = this.getRow(rowIndex);
    await this.selectedRow(row);

    await this.deleteSelectedButton.click();
    await this.yesConfirmationButton.click();
  }

  /**
   * Expect that a row is not visible (useful after deletion)
   */
  async expectRowNotVisible(
    columnName: string,
    searchValue: string,
  ): Promise<void> {
    const rowIndex = await this.findRowIndexByCellContent(
      columnName,
      searchValue,
    );

    await expect(rowIndex).toBe(-1);
  }

  async expectRowVisible(
    columnName: string,
    searchValue: string,
  ): Promise<void> {
    const rowIndex = await this.findRowIndexByCellContent(
      columnName,
      searchValue,
    );

    await expect(this.getRow(rowIndex)).toBeVisible();
  }

  /**
   * Expect table is sorted by field in specified order
   */
  async expectSortedByField(options: {
    field: string;
    order: 'asc' | 'desc';
  }): Promise<void> {
    const { field, order } = options;
    const columnIndex = await this.getColumnIndex(field);
    const rowCount = await this.getRowCount();

    const values: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cellText = await this.getCellText(i, columnIndex);
      values.push(cellText);
    }

    // Sort the values array
    values.sort((a, b) => {
      // Handle different data types
      if (this.isNumeric(a) && this.isNumeric(b)) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        return order === 'asc' ? numA - numB : numB - numA;
      }

      if (this.isDate(a) && this.isDate(b)) {
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // String comparison (case-insensitive)
      const comparison = a.toLowerCase().localeCompare(b.toLowerCase());
      return order === 'asc' ? comparison : -comparison;
    });

    // Create sorted copy for comparison
    const sortedValues = [...values];

    expect(values).toEqual(sortedValues);
  }
  /**
   * Check if value is numeric
   */
  private isNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }

  /**
   * Check if value is a date
   */
  private isDate(value: string): boolean {
    return !isNaN(Date.parse(value));
  }

  /**
   * Expect row data matches expected data (enhanced version)
   */
  async expectRowData(
    searchColumn: string,
    searchValue: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectedData: Record<string, any>,
  ): Promise<void> {
    const rowIndex = await this.findRowIndexByCellContent(
      searchColumn,
      searchValue,
    );

    const actualRowData = await this.getRowData(rowIndex);

    // Compare each expected field with normalization
    for (const [key, expectedValue] of Object.entries(expectedData)) {
      if (actualRowData[key] !== undefined) {
        let actualValue = actualRowData[key];
        let normalizedExpected = expectedValue;

        // Normalize empty string and 'N/A' as equivalent for any field
        if (
          (actualValue === 'N/A' &&
            (expectedValue === '' || expectedValue === null)) ||
          ((actualValue === '' || actualValue === null) &&
            expectedValue === 'N/A')
        ) {
          actualValue = '';
          normalizedExpected = '';
        }

        // Normalize boolean strings to booleans if expected is boolean
        if (typeof expectedValue === 'boolean') {
          const actualBool = actualValue.toLowerCase() === 'true';
          expect(actualBool).toBe(expectedValue);
          continue;
        }

        // Normalize date strings by comparing only date part if both look like dates
        const dateRegex = /^\d{4}-\d{2}-\d{2}/;
        if (
          typeof expectedValue === 'string' &&
          typeof actualValue === 'string' &&
          dateRegex.test(expectedValue) &&
          dateRegex.test(actualValue)
        ) {
          const actualDate = new Date(actualValue).toISOString().split('T')[0];
          const expectedDate = new Date(expectedValue)
            .toISOString()
            .split('T')[0];
          expect(actualDate).toBe(expectedDate);
          continue;
        }

        // Default string comparison with trimming
        expect(actualValue.trim()).toContain(String(normalizedExpected).trim());
      }
    }
  }

  /**
   * Select checkbox in a row (if table has checkboxes)
   */
  async selectRowCheckbox(rowIndex: number): Promise<void> {
    const row = this.getRow(rowIndex);
    const checkbox = row.locator('input[type="checkbox"]');
    await checkbox.check();
  }

  /**
   * Bulk select all rows (if table has bulk select)
   */
  async selectAllRows(): Promise<void> {
    const bulkSelectCheckbox = this.table
      .locator('thead input[type="checkbox"]')
      .first();
    await bulkSelectCheckbox.check();
  }

  async openRowDetails(columnName: string, searchValue: string): Promise<void> {
    const rowIndex = await this.findRowIndexByCellContent(
      columnName,
      searchValue,
    );
    const rowLocator = this.getRow(rowIndex);

    await rowLocator
      .locator('td.col-type-action i.ri-arrow-right-line')
      .click();
  }
}
