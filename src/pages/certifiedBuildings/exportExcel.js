import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

export const exportToExcel = async (buildings) => {
  if (buildings && buildings.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const createDate = moment(new Date()).format('YYYY-MM-DD');
    const worksheet = workbook.addWorksheet(`Certified Buildings ${createDate}`);

    worksheet.columns = [
      { header: "Customer", key: "customer", width: 25 },
      { header: "Project ID", key: "projectId", width: 15 },
      { header: "Project", key: "projectName", width: 25 },
      { header: "Private", key: "privateProject", width: 15 },
      { header: "Tax Year", key: "taxYear", width: 10 },
      { header: "State", key: "state", width: 10 },
      { header: "Inspection Date", key: "inspectionDate", width: 15 },
      { header: "Certified Date", key: "certifiedDate", width: 15 },
      { header: "Legal Entity", key: "legalEntity", width: 25 },
      { header: "Certifier", key: "certifier", width: 25 },
      { header: "Building Name", key: "buildingName", width: 25 },
      { header: "Address", key: "address", width: 30 },
      { header: "Type", key: "type", width: 20 },
      { header: "Area", key: "area", width: 10 },
      { header: "Rate", key: "rate", width: 10 },
      { header: "PW Rate", key: "pwRate", width: 10 },
      { header: "Deduction", key: "deduction", width: 15 },
      { header: "PW Deduction", key: "pwDeduction", width: 15 },
      { header: "Percent Saving", key: "percentSaving", width: 15 },
    ];

    const amountCell = worksheet.getCell(1,1);
    amountCell.value = `Certified Buildings Amount: ${buildings.length}`;
    amountCell.font = { bold: true, size: 12 };
    amountCell.alignment = { vertical: 'bottom', horizontal: 'left' };
    worksheet.mergeCells(1, 1, 1, 19);

    const totalArea = buildings.reduce((acc, building) => acc + (parseFloat(building.area) || 0), 0);
    const areaCell = worksheet.getCell(2,1);
    areaCell.value = `Total Area: ${totalArea.toFixed(2)} sqft`;
    areaCell.font = { bold: true, size: 12 };
    areaCell.alignment = { vertical: 'bottom', horizontal: 'left' };
    worksheet.mergeCells(2, 1, 2, 19);

    const totalDeduction = buildings.reduce((acc, building) => acc + (parseFloat(building.deduction) || 0), 0);
    const deductionCell = worksheet.getCell(3,1);
    deductionCell.value = `Total Deduction: $${totalDeduction.toFixed(2)}`;
    deductionCell.font = { bold: true, size: 12 };
    deductionCell.alignment = { vertical: 'bottom', horizontal: 'left' };
    worksheet.mergeCells(3, 1, 3, 19);

    const totalPercentSaving = buildings.reduce((acc, building) => acc + (parseFloat(building.percentSaving) || 0), 0);
    const averagePercentSaving = buildings.length > 0 ? totalPercentSaving / buildings.length : 0;
    const percentSavingCell = worksheet.getCell(4,1);
    percentSavingCell.value = `Average Percent Saving: ${averagePercentSaving.toFixed(2)}%`;
    percentSavingCell.font = { bold: true, size: 12 };
    percentSavingCell.alignment = { vertical: 'bottom', horizontal: 'left' };
    worksheet.mergeCells(4, 1, 4, 19);

    const emptyRow = worksheet.getCell(4,1);
    worksheet.mergeCells(5, 1, 5, 19);

    const headersRow = worksheet.columns.map(column => {
      return column.header;
    });
    worksheet.addRow(headersRow);

    const headerRow = worksheet.getRow(6);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { bottom: { style: 'thin' } };
    });

    buildings.forEach((building) => {
      if (building.privateProject ) {
        building.privateProject = 'Private';
      } else {
        building.privateProject = 'Public';
      }
      worksheet.addRow(building);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `Certified Buildings ${createDate}.xlsx`);
  }
};
