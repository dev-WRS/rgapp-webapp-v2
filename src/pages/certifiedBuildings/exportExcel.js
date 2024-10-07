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

export const exportToExcelCertifiedBuilding = async (certifiedBuilding) => {
		const openCB = "\u2B1C"; // Open checkbox ▢
		const markedCB = "\u2B1B"; // Filled checkbox ■

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Form 7205");

		worksheet.columns = [
			{ key: "A", width: 12 },
			{ key: "B", width: 12 },
			{ key: "C", width: 12 },
			{ key: "D", width: 12 },
			{ key: "E", width: 12 },
			{ key: "F", width: 12 },
			{ key: "G", width: 12 },
			{ key: "H", width: 12 },
			{ key: "I", width: 12 },
			{ key: "J", width: 12 },
			{ key: "K", width: 12 },
			{ key: "L", width: 12 },
			{ key: "M", width: 15 },
			{ key: "N", width: 12 },
			{ key: "O", width: 8.14 },
			{ key: "P", width: 5 },
			{ key: "Q", width: 12 },
			{ key: "R", width: 12 },
			{ key: "S", width: 12 },
			{ key: "T", width: 12 },
			{ key: "U", width: 12 },
			{ key: "V", width: 12 },
			{ key: "W", width: 12 },
			{ key: "X", width: 12 },
		];

		// Row 1: Title
		worksheet.mergeCells("A1:X1");
		worksheet.getRow(1).height = 57;
		const titleCell = worksheet.getCell("A1");
		titleCell.value = "FORM 7205 (REV DEC 2023) REPORT";
		titleCell.alignment = { vertical: "middle", horizontal: "center" };
		titleCell.font = { bold: true, size: 20, color: { argb: "FFFFFFFF" } };
		titleCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FF424A22" },
		};

		// Row 2
		worksheet.mergeCells("A2:B2");
		worksheet.getRow(2).height = 29.25;
		const nameCell = worksheet.getCell("A2");
		nameCell.value = "Name(s) shown on return";
		nameCell.alignment = { vertical: "middle", horizontal: "left" };
		nameCell.font = { bold: true, size: 11 };
		nameCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFD8E4BC" },
		};

		worksheet.mergeCells("C2:S2");
		worksheet.getCell("C2").style = {
		fill: {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: "FFFDF6E6" },
		},
		alignment: { vertical: "middle", horizontal: "left" },
		};
		// Leave cells C2:S2 blank

		worksheet.mergeCells("T2:U2");
		const idNumberLabelCell = worksheet.getCell("T2");
		idNumberLabelCell.value = "Identifying Number";
		idNumberLabelCell.alignment = { vertical: "middle", horizontal: "center" };
		idNumberLabelCell.font = { bold: true, size: 11 };
		idNumberLabelCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFD8E4BC" },
		};

		worksheet.mergeCells("V2:X2");
		const idNumberCell = worksheet.getCell("V2");
		idNumberCell.value = "XX-XXXXXXX";
		idNumberCell.alignment = { vertical: "middle", horizontal: "center" };
		idNumberCell.font = { bold: true, size: 11 };

		// Row 3
		worksheet.mergeCells("A3:H3");
		worksheet.getRow(3).height = 24.75;
		const deductionCell = worksheet.getCell("A3");
		deductionCell.value =
		"Claiming deduction as (check one): Designer of energy efficient property (EEP)";
		deductionCell.alignment = { vertical: "middle", horizontal: "left" };
		deductionCell.font = { size: 11 };

		const designerCheckCell = worksheet.getCell("I3");
		designerCheckCell.alignment = { vertical: "middle", horizontal: "center" };
		// Set up certifiedBuilding validation for checkbox
		designerCheckCell.dataValidation = {
		type: "list",
		allowBlank: false,
		formulae: ['"' + openCB + "," + markedCB + '"'],
		showDropDown: true,
		};
		designerCheckCell.value = certifiedBuilding.privateProject == false ? openCB : markedCB;

		worksheet.mergeCells("J3:L3");
		const ownerLabelCell = worksheet.getCell("J3");
		ownerLabelCell.value = "Building owner";
		ownerLabelCell.alignment = { vertical: "middle", horizontal: "left" };
		ownerLabelCell.font = { bold: true, size: 11 };

		const ownerCheckCell = worksheet.getCell("M3");
		ownerCheckCell.alignment = { vertical: "middle", horizontal: "center" };
		ownerCheckCell.dataValidation = {
		type: "list",
		allowBlank: false,
		formulae: ['"' + openCB + "," + markedCB + '"'],
		showDropDown: true,
		};
		ownerCheckCell.value = certifiedBuilding.privateProject == false  ? markedCB : openCB;

		worksheet.mergeCells("N3:X3");
		const duplicateDesignerCell = worksheet.getCell("N3");
		duplicateDesignerCell.value = "Designer of energy efficient property (EEP)";
		duplicateDesignerCell.alignment = {
		vertical: "middle",
		horizontal: "left",
		};
		duplicateDesignerCell.font = { bold: true, size: 11 };

		// Part I Header
		worksheet.mergeCells("A4:B4");
		worksheet.getRow(4).height = 24.75;
		const partICell = worksheet.getCell("A4");
		partICell.value = "Part I";
		partICell.alignment = { vertical: "middle", horizontal: "left" };
		partICell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
		partICell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FF595959" },
		};

		worksheet.mergeCells("C4:X4");
		const partITitleCell = worksheet.getCell("C4");
		partITitleCell.value = "Building and EEP Information (see instructions)";
		partITitleCell.alignment = { vertical: "middle", horizontal: "left" };
		partITitleCell.font = { bold: true, size: 12 };
		partITitleCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFD8E4BC" },
		};

		// Table Headers (Row 5)
		worksheet.getCell("A5").value = "1";
		worksheet.getCell("A5").font = { bold: true };
		worksheet.getCell("A5").alignment = { vertical: "top", horizontal: "left" };
		worksheet.getRow(5).height = 90.75;
		worksheet.getRow(5).alignment = {
		vertical: "top",
		horizontal: "left",
		wrapText: true,
		};

		worksheet.mergeCells("B5:F5");
		const headerAFCell = worksheet.getCell("B5");
		headerAFCell.value = "(a) Address of building";
		headerAFCell.alignment = { vertical: "middle", horizontal: "center" };
		headerAFCell.font = { bold: true };

		worksheet.mergeCells("G5:H5");
		const headerGHCell = worksheet.getCell("G5");
		headerGHCell.value = "(b) Date EEP placed in service";
		headerGHCell.alignment = { vertical: "middle", horizontal: "center" };
		headerGHCell.font = { bold: true };

		worksheet.mergeCells("I5:K5");
		const headerIKCell = worksheet.getCell("I5");
		headerIKCell.value =
		"(c) Energy efficient commercial building property (EECBP) system computed energy savings percentage, or energy efficient building retrofit property (EEBRP) energy use intensity reduction";
		headerIKCell.alignment = { vertical: "middle", horizontal: "center" };
		headerIKCell.font = { bold: true };

		worksheet.mergeCells("L5:M5");
		const headerLMCell = worksheet.getCell("L5");
		headerLMCell.value =
		"(d) Check if Increased Deduction criteria met (see instructions)";
		headerLMCell.alignment = { vertical: "middle", horizontal: "center" };
		headerLMCell.font = { bold: true };

		worksheet.mergeCells("N5:P5");
		const headerNPCell = worksheet.getCell("N5");
		headerNPCell.value =
		"(e) Check if EEBRP installed under a Qualified Retrofit Plan";
		headerNPCell.alignment = { vertical: "middle", horizontal: "center" };
		headerNPCell.font = { bold: true };

		worksheet.mergeCells("Q5:R5");
		const headerQRCell = worksheet.getCell("Q5");
		headerQRCell.value = "(f) Potential amount per square foot";
		headerQRCell.alignment = { vertical: "middle", horizontal: "center" };
		headerQRCell.font = { bold: true };

		worksheet.mergeCells("S5:U5");
		const headerSUCell = worksheet.getCell("S5");
		headerSUCell.value = "(g) Building square footage";
		headerSUCell.alignment = { vertical: "middle", horizontal: "center" };
		headerSUCell.font = { bold: true };

		worksheet.mergeCells("V5:X5");
		const headerVXCell = worksheet.getCell("V5");
		headerVXCell.value =
		"(h) Potential section 179D deduction amount (multiply column 1(f) by column 1(g))";
		headerVXCell.alignment = { vertical: "middle", horizontal: "center" };
		headerVXCell.font = { bold: true };

		// Building Data (Rows 6–10)
		const startRow = 6;
		certifiedBuilding.buildings.forEach((building, index) => {
		const rowNumber = startRow + index;
		worksheet.getRow(rowNumber).height = 24.75;

		// Building Number
		const buildingNumberCell = worksheet.getCell(`A${rowNumber}`);
		buildingNumberCell.value = getBuildingCode(index);
		buildingNumberCell.alignment = {
			vertical: "middle",
			horizontal: "right",
		};
		buildingNumberCell.font = { bold: true };

		// Address (Merged B-F)
		worksheet.mergeCells(`B${rowNumber}:F${rowNumber}`);
		const addressCell = worksheet.getCell(`B${rowNumber}`);
		addressCell.value = building.address;
		addressCell.alignment = { vertical: "middle", horizontal: "center" };

		// Date EEP placed in service (Merged G-H)
		worksheet.mergeCells(`G${rowNumber}:H${rowNumber}`);
		const datePlacedCell = worksheet.getCell(`G${rowNumber}`);
		datePlacedCell.value = certifiedBuilding.taxYear; // Assuming taxYear is used here
		datePlacedCell.alignment = { vertical: "middle", horizontal: "center" };

		// Energy savings percentage (Merged I-K)
		worksheet.mergeCells(`I${rowNumber}:K${rowNumber}`);
		const percentSavingCell = worksheet.getCell(`I${rowNumber}`);
		percentSavingCell.value = building.percentSaving / 100;
		percentSavingCell.alignment = {
			vertical: "middle",
			horizontal: "center",
		};
		percentSavingCell.numFmt = "0.00%";

		// Check if Increased Deduction criteria met (Merged L-M)
		worksheet.mergeCells(`L${rowNumber}:M${rowNumber}`);
		const increasedDeductionCell = worksheet.getCell(`L${rowNumber}`);
		increasedDeductionCell.alignment = {
			vertical: "middle",
			horizontal: "center",
		};
		increasedDeductionCell.value = openCB;
		increasedDeductionCell.dataValidation = {
			type: "list",
			allowBlank: false,
			formulae: ['"' + openCB + "," + markedCB + '"'],
			showDropDown: true,
		};
		increasedDeductionCell.font = { size: 11 };

		// Check if EEBRP installed (Merged N-P)
		worksheet.mergeCells(`N${rowNumber}:P${rowNumber}`);
		const eeBRPCell = worksheet.getCell(`N${rowNumber}`);
		eeBRPCell.alignment = { vertical: "middle", horizontal: "center" };
		eeBRPCell.value = openCB;
		eeBRPCell.dataValidation = {
			type: "list",
			allowBlank: false,
			formulae: ['"' + openCB + "," + markedCB + '"'],
			showDropDown: true,
		};
		eeBRPCell.font = { size: 11 };

		// Potential amount per square foot (Merged Q-R)
		worksheet.mergeCells(`Q${rowNumber}:R${rowNumber}`);
		const potentialAmountCell = worksheet.getCell(`Q${rowNumber}`);
		potentialAmountCell.alignment = {
			vertical: "middle",
			horizontal: "center",
		};
		// Formula: IF(1(d)=markedCB, key "pwRate", key "rate")
		const increasedDeductionRef = `L${rowNumber}`;
		potentialAmountCell.value = {
			formula: `IF(${increasedDeductionRef}="${markedCB}", ${building.pwRate}, ${building.rate})`,
		};
		potentialAmountCell.numFmt =
			'_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

		// Building square footage (Merged S-U)
		worksheet.mergeCells(`S${rowNumber}:U${rowNumber}`);
		const areaCell = worksheet.getCell(`S${rowNumber}`);
		areaCell.value = building.area;
		areaCell.alignment = { vertical: "middle", horizontal: "center" };
		areaCell.numFmt = "#,##0";

		// Potential section 179D deduction amount (Merged V-X)
		worksheet.mergeCells(`V${rowNumber}:X${rowNumber}`);
		const deductionAmountCell = worksheet.getCell(`V${rowNumber}`);
		deductionAmountCell.alignment = {
			vertical: "middle",
			horizontal: "center",
		};
		// Formula: 1(g) * 1(f)
		const potentialAmountRef = `Q${rowNumber}`;
		const areaRef = `S${rowNumber}`;
		deductionAmountCell.value = {
			formula: `${potentialAmountRef}*${areaRef}`,
		};
		deductionAmountCell.numFmt =
			'_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
		});

		// Part II Header (Row 11)
		const partIIStartRow = startRow + certifiedBuilding.buildings.length;
		const partIIRow = partIIStartRow + 1;

		worksheet.mergeCells(`A${partIIRow}:B${partIIRow}`);
		worksheet.getRow(partIIRow).height = 24.75;
		const partIICell = worksheet.getCell(`A${partIIRow}`);
		partIICell.value = "Part II";
		partIICell.alignment = { vertical: "middle", horizontal: "left" };
		partIICell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
		partIICell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FF595959" },
		};

		worksheet.mergeCells(`C${partIIRow}:X${partIIRow}`);
		const partIITitleCell = worksheet.getCell(`C${partIIRow}`);
		partIITitleCell.value =
		"Computation of Energy Efficient Commercial Buildings Deduction Amount (see instructions)";
		partIITitleCell.alignment = { vertical: "middle", horizontal: "left" };
		partIITitleCell.font = { bold: true, size: 12 };
		partIITitleCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFD8E4BC" },
		};

		// Table Headers (Row 12)
		const header2Row = partIIRow + 1;

		worksheet.getCell(`A${header2Row}`).value = "2";
		worksheet.getCell(`A${header2Row}`).font = { bold: true };
		worksheet.getCell(`A${header2Row}`).alignment = {
		vertical: "top",
		horizontal: "left",
		};
		worksheet.getRow(header2Row).height = 81.75;

		worksheet.mergeCells(`B${header2Row}:E${header2Row}`);
		const header2aCell = worksheet.getCell(`B${header2Row}`);
		header2aCell.value =
		"(a) Total per square foot amount claimed in prior years (see instructions)";
		header2aCell.alignment = { vertical: "middle", horizontal: "center" };
		header2aCell.font = { bold: true };

		worksheet.mergeCells(`F${header2Row}:J${header2Row}`);
		const header2bCell = worksheet.getCell(`F${header2Row}`);
		header2bCell.value =
		"(b) Subtract column 2(a) from the maximum amount allowed (see instructions)";
		header2bCell.alignment = { vertical: "middle", horizontal: "center" };
		header2bCell.font = { bold: true };

		worksheet.mergeCells(`K${header2Row}:L${header2Row}`);
		const header2cCell = worksheet.getCell(`K${header2Row}`);
		header2cCell.value =
		"(c) Check if the amount in column 2(b) is greater than or equal to column 1(f)";
		header2cCell.alignment = { vertical: "middle", horizontal: "center" };
		header2cCell.font = { bold: true };

		worksheet.mergeCells(`M${header2Row}:Q${header2Row}`);
		const header2dCell = worksheet.getCell(`M${header2Row}`);
		header2dCell.value =
		"(d) If column 2(c) is checked, enter the amount from column 1(h). Skip columns 2(e) and 2(f), and go to column 2(g)";
		header2dCell.alignment = { vertical: "middle", horizontal: "center" };
		header2dCell.font = { bold: true };

		worksheet.mergeCells(`R${header2Row}:U${header2Row}`);
		const header2eCell = worksheet.getCell(`R${header2Row}`);
		header2eCell.value =
		"(e) Check if the amount from column 2(b) is less than the amount in column 1(f)";
		header2eCell.alignment = { vertical: "middle", horizontal: "center" };
		header2eCell.font = { bold: true };

		worksheet.mergeCells(`V${header2Row}:X${header2Row}`);
		const header2fCell = worksheet.getCell(`V${header2Row}`);
		header2fCell.value =
		"(f) If column 2(e) is checked, multiply column 2(b) by column 1(g)";
		header2fCell.alignment = { vertical: "middle", horizontal: "center" };
		header2fCell.font = { bold: true };

		worksheet.getRow(header2Row).alignment = {
		vertical: "top",
		horizontal: "left",
		wrapText: true,
		};

		// Rows 13 and on (Building Data for Part II)
		const partIIDataStartRow = header2Row + 1;
		certifiedBuilding.buildings.forEach((building, index) => {
		const rowNumber = partIIDataStartRow + index;
		const sumRowStartNumber = rowNumber;
		worksheet.getRow(rowNumber).height = 24.75;
		// Building Number
		const buildingNumberCell = worksheet.getCell(`A${rowNumber}`);
		buildingNumberCell.value = getBuildingCode(index);
		buildingNumberCell.alignment = {
			vertical: "middle",
			horizontal: "right",
		};
		buildingNumberCell.font = { bold: true };

		// Column 2(a): Empty cell for user input
		worksheet.mergeCells(`B${rowNumber}:E${rowNumber}`);
		worksheet.getCell(`B${rowNumber}`).style = {
			numFmt: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
			border: { bottom: { style: "thin" } },
		};

		// Column 2(b): Formula: Max allowed amount - value in 2(a)
		worksheet.mergeCells(`F${rowNumber}:J${rowNumber}`);
		const col2bCell = worksheet.getCell(`F${rowNumber}`);
		col2bCell.alignment = { vertical: "middle", horizontal: "center" };
		col2bCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

		// Assuming maximum amount is from Table I column 1(f)
		const potentialAmountPerSqFtRef = `Q${startRow + index}`;

		const col2aRef = `B${rowNumber}`;
		col2bCell.value = {
			formula: `${potentialAmountPerSqFtRef}-${col2aRef}`,
		};

		// Column 2(c): Check if 2(b) >= 1(f)
		worksheet.mergeCells(`K${rowNumber}:L${rowNumber}`);
		const col2cCell = worksheet.getCell(`K${rowNumber}`);
		col2cCell.alignment = { vertical: "middle", horizontal: "center" };
		// Display "■" or "▢" based on formula
		col2cCell.value = {
			formula: `IF(${col2bCell.address}>=${potentialAmountPerSqFtRef},"${markedCB}","${openCB}")`,
		};

		// Column 2(d): If 2(c) is markedCB, get value from 1(h)
		worksheet.mergeCells(`M${rowNumber}:Q${rowNumber}`);
		const col2dCell = worksheet.getCell(`M${rowNumber}`);
		col2dCell.alignment = { vertical: "middle", horizontal: "center" };

		const deductionAmountRef = `V${startRow + index}`;
		col2dCell.value = {
			formula: `IF(${col2cCell.address}="${markedCB}",${deductionAmountRef},"")`,
		};
		col2dCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

		// Column 2(e): Check if 2(b) < 1(f)
		worksheet.mergeCells(`R${rowNumber}:U${rowNumber}`);
		const col2eCell = worksheet.getCell(`R${rowNumber}`);
		col2eCell.alignment = { vertical: "middle", horizontal: "center" };
		// Display "■" or "▢" based on formula
		col2eCell.value = {
			formula: `IF(${col2bCell.address}<${potentialAmountPerSqFtRef},"${markedCB}","${openCB}")`,
		};

		// Column 2(f): If 2(e) is markedCB, multiply 2(b) by 1(g)
		worksheet.mergeCells(`V${rowNumber}:X${rowNumber}`);
		const col2fCell = worksheet.getCell(`V${rowNumber}`);
		col2fCell.alignment = { vertical: "middle", horizontal: "center" };

		const areaRef = `S${startRow + index}`;
		col2fCell.value = {
			formula: `IF(${col2eCell.address}="${markedCB}",${col2bCell.address}*${areaRef},"")`,
		};
		col2fCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
		});

		// Table 2B
		const table2BHeaderRow = partIIDataStartRow + certifiedBuilding.buildings.length + 1;

		// Table 2B Headers
		worksheet.getCell(`A${table2BHeaderRow}`).value = "";
		worksheet.getRow(table2BHeaderRow).height = 68.25;

		worksheet.mergeCells(`B${table2BHeaderRow}:E${table2BHeaderRow}`);
		const header2gCell = worksheet.getCell(`B${table2BHeaderRow}`);
		header2gCell.value =
		"(g) Cost of EEP placed in service during the tax year (see instructions if building ownership percentage is less than 100%)";
		header2gCell.alignment = { vertical: "middle", horizontal: "center" };
		header2gCell.font = { bold: true };

		worksheet.mergeCells(`F${table2BHeaderRow}:J${table2BHeaderRow}`);
		const header2hCell = worksheet.getCell(`F${table2BHeaderRow}`);
		header2hCell.value =
		"(h) Enter the greater of column 2(d) or column 2(f) (see instructions if building ownership percentage is less than 100%)";
		header2hCell.alignment = { vertical: "middle", horizontal: "center" };
		header2hCell.font = { bold: true };

		worksheet.mergeCells(`K${table2BHeaderRow}:N${table2BHeaderRow}`);
		const header2iCell = worksheet.getCell(`K${table2BHeaderRow}`);
		header2iCell.value = "(i) Enter the lesser of column 2(g) or column 2(h)";
		header2iCell.alignment = { vertical: "middle", horizontal: "center" };
		header2iCell.font = { bold: true };

		worksheet.mergeCells(`O${table2BHeaderRow}:T${table2BHeaderRow}`);
		const header2jCell = worksheet.getCell(`O${table2BHeaderRow}`);
		header2jCell.value =
		"(j) Designers enter the amount of the section 179D deduction allocated to you as the designer (see instructions)";
		header2jCell.alignment = { vertical: "middle", horizontal: "center" };
		header2jCell.font = { bold: true };

		worksheet.mergeCells(`U${table2BHeaderRow}:X${table2BHeaderRow}`);
		const header2kCell = worksheet.getCell(`U${table2BHeaderRow}`);
		header2kCell.value =
		"(k) Section 179D deduction for the building (designers, enter the lesser of column 2(i) or column 2(j); building owners, enter the amount from column 2(i))";
		header2kCell.alignment = { vertical: "middle", horizontal: "center" };
		header2kCell.font = { bold: true };
		worksheet.getRow(table2BHeaderRow).alignment = {
		vertical: "top",
		horizontal: "left",
		wrapText: true,
		};

		// Rows for Table 2B
		const table2BDataStartRow = table2BHeaderRow + 1;
		certifiedBuilding.buildings.forEach((building, index) => {
		const rowNumber = table2BDataStartRow + index;
		worksheet.getRow(rowNumber).height = 24.75;

		// Building Number
		const buildingNumberCell = worksheet.getCell(`A${rowNumber}`);
		buildingNumberCell.value = getBuildingCode(index);
		buildingNumberCell.alignment = {
			vertical: "middle",
			horizontal: "right",
		};
		buildingNumberCell.font = { bold: true };

		// Column 2(g): Empty cell for user input
		worksheet.mergeCells(`B${rowNumber}:E${rowNumber}`);
		worksheet.getCell(`B${rowNumber}`).style = {
			numFmt: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
			border: { bottom: { style: "thin" } },
		};

		// Column 2(h): Formula: MAX(2(d), 2(f))
		worksheet.mergeCells(`F${rowNumber}:J${rowNumber}`);
		const col2hCell = worksheet.getCell(`F${rowNumber}`);
		col2hCell.alignment = { vertical: "middle", horizontal: "center" };

		const col2dRef = `M${partIIDataStartRow + index}`;
		const col2fRef = `V${partIIDataStartRow + index}`;

		col2hCell.value = {
			formula: `MAX(${col2dRef},${col2fRef})`,
		};
		col2hCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

		// Column 2(i): MIN(2(g), 2(h))
		worksheet.mergeCells(`K${rowNumber}:N${rowNumber}`);
		const col2iCell = worksheet.getCell(`K${rowNumber}`);
		col2iCell.alignment = { vertical: "middle", horizontal: "center" };

		const col2gRef = `B${rowNumber}`; // User input
		col2iCell.value = {
			formula: `MIN(${col2gRef},${col2hCell.address})`,
		};
		col2iCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

		// Column 2(j): Empty cell for user input
		worksheet.mergeCells(`O${rowNumber}:T${rowNumber}`);
		worksheet.getCell(`O${rowNumber}`).style = {
			numFmt: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
			border: { bottom: { style: "thin" } },
		};

		// Column 2(k): If certifiedBuilding.ownerType == "public", MIN(2(i), 2(j)); else 2(i)
		worksheet.mergeCells(`U${rowNumber}:X${rowNumber}`);
		const col2kCell = worksheet.getCell(`U${rowNumber}`);
		col2kCell.alignment = { vertical: "middle", horizontal: "center" };

		const col2jRef = `O${rowNumber}`; // User input

		if (certifiedBuilding.privateProject == false ) {
			col2kCell.value = {
			formula: `MIN(${col2iCell.address},${col2jRef})`,
			};
		} else {
			col2kCell.value = {
			formula: `${col2iCell.address}`,
			};
		}
		col2kCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
		});

		const endRow = table2BDataStartRow + certifiedBuilding.buildings.length;
		const formulaRange = `U${table2BDataStartRow}:X${endRow - 1}`;
		worksheet.mergeCells(`B${endRow}:S${endRow}`);
		worksheet.getCell(`B${endRow}`).value =
		"Total section 179D deduction. Add amounts from column 2(k). Enter here and on the appropriate line of your return. See instructions . . . . . . . . . . . . . . . . . . . .";
		worksheet.getCell(`B${endRow}`).font = { bold: true };
		worksheet.getCell(`B${endRow}`).alignment = {
		vertical: "middle",
		horizontal: "left",
		};
		worksheet.getCell(`T${endRow}`).value = "3";
		worksheet.getCell(`T${endRow}`).font = { bold: true };
		worksheet.mergeCells(`U${endRow}:X${endRow}`);
		worksheet.getRow(endRow).height = 24.75;
		worksheet.getCell(`A${endRow}`).value = "3";
		worksheet.getCell(`A${endRow}`).font = { bold: true };
		worksheet.getCell(`A${endRow}`).alignment = {
		vertical: "top",
		horizontal: "left",
		};
		const sumTotalCell = worksheet.getCell(`U${endRow}`);
		sumTotalCell.value = { formula: `SUM(${formulaRange})` };
		sumTotalCell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';

		// Part III Header
		const partIIIStartRow = table2BDataStartRow + certifiedBuilding.buildings.length + 1;

		worksheet.mergeCells(`A${partIIIStartRow}:B${partIIIStartRow}`);
		const partIIICell = worksheet.getCell(`A${partIIIStartRow}`);
		partIIICell.value = "Part III";
		partIIICell.alignment = { vertical: "middle", horizontal: "left" };
		partIIICell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
		partIIICell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FF595959" },
		};

		worksheet.mergeCells(`C${partIIIStartRow}:X${partIIIStartRow}`);
		const partIIITitleCell = worksheet.getCell(`C${partIIIStartRow}`);
		partIIITitleCell.value =
		"Certification Information for Each Property Listed in Part I (see instructions)";
		partIIITitleCell.alignment = { vertical: "middle", horizontal: "left" };
		partIIITitleCell.font = { bold: true, size: 12 };
		partIIITitleCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFD8E4BC" },
		};
		worksheet.getRow(partIIIStartRow).height = 24.75;
		// Table Headers (Row 25)
		const partIIIHeaderRow = partIIIStartRow + 1;

		worksheet.getCell(`A${partIIIHeaderRow}`).value = "4";
		worksheet.getCell(`A${partIIIHeaderRow}`).font = { bold: true };
		worksheet.getCell(`A${partIIIHeaderRow}`).alignment = {
		vertical: "top",
		horizontal: "left",
		};

		worksheet.mergeCells(`B${partIIIHeaderRow}:G${partIIIHeaderRow}`);
		const header3aCell = worksheet.getCell(`B${partIIIHeaderRow}`);
		header3aCell.value =
		"(a) Name of Qualified Individual completing certification";
		header3aCell.alignment = { vertical: "middle", horizontal: "center" };
		header3aCell.font = { bold: true };

		worksheet.mergeCells(`H${partIIIHeaderRow}:I${partIIIHeaderRow}`);
		const header3bCell = worksheet.getCell(`H${partIIIHeaderRow}`);
		header3bCell.value = "(b) Date of certification";
		header3bCell.alignment = { vertical: "middle", horizontal: "center" };
		header3bCell.font = { bold: true };

		worksheet.mergeCells(`J${partIIIHeaderRow}:O${partIIIHeaderRow}`);
		const header3cCell = worksheet.getCell(`J${partIIIHeaderRow}`);
		header3cCell.value = "(c) Employer of Qualified Individual";
		header3cCell.alignment = { vertical: "middle", horizontal: "center" };
		header3cCell.font = { bold: true };

		worksheet.mergeCells(`P${partIIIHeaderRow}:X${partIIIHeaderRow}`);
		const header3dCell = worksheet.getCell(`P${partIIIHeaderRow}`);
		header3dCell.value = "(d) Address of Qualified Individual";
		header3dCell.alignment = { vertical: "middle", horizontal: "center" };
		header3dCell.font = { bold: true };
		worksheet.getRow(partIIIHeaderRow).size = 68.25;
		worksheet.getRow(partIIIHeaderRow).alignment = {
		vertical: "top",
		horizontal: "left",
		wrapText: true,
		};
		worksheet.getRow(partIIIHeaderRow).height = 42;

		// Rows 26 onwards (Certifier Information)
		const partIIIDataRow = partIIIHeaderRow + 1;

		worksheet.getCell(`A${partIIIDataRow}`).value = "A"; // Assuming only one certifier
		worksheet.getCell(`A${partIIIDataRow}`).alignment = {
		vertical: "middle",
		horizontal: "right",
		};
		worksheet.getCell(`A${partIIIDataRow}`).font = { bold: true };
		worksheet.getRow(partIIIDataRow).height = 24.75;

		worksheet.mergeCells(`B${partIIIDataRow}:G${partIIIDataRow}`);
		const certifierNameCell = worksheet.getCell(`B${partIIIDataRow}`);
		certifierNameCell.value = certifiedBuilding.certifier;
		certifierNameCell.alignment = { vertical: "middle", horizontal: "left" };

		worksheet.mergeCells(`H${partIIIDataRow}:I${partIIIDataRow}`);
		const certifiedDateCell = worksheet.getCell(`H${partIIIDataRow}`);
		certifiedDateCell.value = new Date(certifiedBuilding.certifiedDate);
		certifiedDateCell.numFmt = "MM/DD/YYYY";
		certifiedDateCell.alignment = { vertical: "middle", horizontal: "center" };

		worksheet.mergeCells(`J${partIIIDataRow}:O${partIIIDataRow}`);
		const employerCell = worksheet.getCell(`J${partIIIDataRow}`);
		employerCell.value = "Walker Reid Strategies, Inc.";
		employerCell.alignment = { vertical: "middle", horizontal: "left" };

		worksheet.mergeCells(`P${partIIIDataRow}:X${partIIIDataRow}`);
		const addressCell = worksheet.getCell(`P${partIIIDataRow}`);
		addressCell.value =
		"1225 Broken Sound Parkway NW Ste C Boca Raton, FL 33487";
		addressCell.alignment = { vertical: "middle", horizontal: "left" };

		// Part IV Header
		const partIVStartRow = partIIIDataRow + 2;
		worksheet.getRow(partIVStartRow).height = 24.75;
		worksheet.mergeCells(`A${partIVStartRow}:B${partIVStartRow}`);
		const partIVCell = worksheet.getCell(`A${partIVStartRow}`);
		partIVCell.value = "Part IV";
		partIVCell.alignment = { vertical: "middle", horizontal: "left" };
		partIVCell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
		partIVCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FF595959" },
		};

		worksheet.mergeCells(`C${partIVStartRow}:X${partIVStartRow}`);
		const partIVTitleCell = worksheet.getCell(`C${partIVStartRow}`);
		partIVTitleCell.value =
		"Designer Allocation Information for Each Property Listed in Part I (to be completed by Designer only)";
		partIVTitleCell.alignment = { vertical: "middle", horizontal: "left" };
		partIVTitleCell.font = { bold: true, size: 12 };
		partIVTitleCell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFD8E4BC" },
		};

		// Table Headers (Row 28)
		const partIVHeaderRow = partIVStartRow + 1;
		worksheet.getRow(partIVHeaderRow).height = 42;

		worksheet.getCell(`A${partIVHeaderRow}`).value = "5";
		worksheet.getCell(`A${partIVHeaderRow}`).alignment = {
		vertical: "top",
		horizontal: "left",
		};
		worksheet.getCell(`A${partIVHeaderRow}`).font = { bold: true };

		worksheet.mergeCells(`B${partIVHeaderRow}:G${partIVHeaderRow}`);
		const header4aCell = worksheet.getCell(`B${partIVHeaderRow}`);
		header4aCell.value = "(a) Identified owner of building";
		header4aCell.alignment = { vertical: "middle", horizontal: "center" };
		header4aCell.font = { bold: true };

		worksheet.mergeCells(`H${partIVHeaderRow}:I${partIVHeaderRow}`);
		const header4bCell = worksheet.getCell(`H${partIVHeaderRow}`);
		header4bCell.value = "(b) Date of allocation";
		header4bCell.alignment = { vertical: "middle", horizontal: "center" };
		header4bCell.font = { bold: true };

		worksheet.mergeCells(`J${partIVHeaderRow}:O${partIVHeaderRow}`);
		const header4cCell = worksheet.getCell(`J${partIVHeaderRow}`);
		header4cCell.value =
		"(c) Name of building owner's authorized representative completing allocation";
		header4cCell.alignment = { vertical: "middle", horizontal: "center" };
		header4cCell.font = { bold: true };

		worksheet.mergeCells(`P${partIVHeaderRow}:X${partIVHeaderRow}`);
		const header4dCell = worksheet.getCell(`P${partIVHeaderRow}`);
		header4dCell.value =
		"(d) Address of building owner's authorized representative";
		header4dCell.alignment = { vertical: "middle", horizontal: "center" };
		header4dCell.font = { bold: true };
		worksheet.getRow(partIVHeaderRow).alignment = {
		vertical: "top",
		horizontal: "left",
		wrapText: true,
		};

		// Rows 29 onwards (Allocation Information)
		if (certifiedBuilding.privateProject == false ) {
		const rowNumber = partIVHeaderRow + 1;
		worksheet.getRow(rowNumber).height = 24.75;

		// Building Number
		const buildingNumberCell = worksheet.getCell(`A${rowNumber}`);
		buildingNumberCell.value = "A"; // Assuming a single building entry
		buildingNumberCell.alignment = {
			vertical: "middle",
			horizontal: "right",
		};
		buildingNumberCell.font = { bold: true };

		// Column 4(a): building.name (or certifiedBuilding.name in this context)
		worksheet.mergeCells(`B${rowNumber}:G${rowNumber}`);
		const col4aCell = worksheet.getCell(`B${rowNumber}`);
		col4aCell.value = certifiedBuilding.name;
		col4aCell.alignment = { vertical: "middle", horizontal: "left" };

		// Column 4(b): taxYear
		worksheet.mergeCells(`H${rowNumber}:I${rowNumber}`);
		const col4bCell = worksheet.getCell(`H${rowNumber}`);
		col4bCell.value = certifiedBuilding.taxYear;
		col4bCell.alignment = { vertical: "middle", horizontal: "center" };

		// Column 4(c): Empty
		worksheet.mergeCells(`J${rowNumber}:O${rowNumber}`);
		worksheet.getCell(`J${rowNumber}`).style = {
			alignment: { vertical: "middle" },
			border: { bottom: { style: "thin" } },
		};

		// Column 4(d): Empty
		worksheet.mergeCells(`P${rowNumber}:X${rowNumber}`);
		worksheet.getCell(`P${rowNumber}`).style = {
			alignment: { vertical: "middle" },
			border: { bottom: { style: "thin" } },
		};
		}

		worksheet.getRow(5).eachCell((cell) => {
		cell.alignment = { wrapText: true, vertical: "top" };
		});
		const borderStyle = {
		top: { style: "thin" },
		left: { style: "thin" },
		bottom: { style: "thin" },
		right: { style: "thin" },
		};
		// Loop through all rows and cells
		worksheet.eachRow((row) => {
		row.eachCell((cell) => {
			// Apply the border style to each cell
			cell.border = borderStyle;
		});
		});
		worksheet.views = [{ state: "normal", zoomScale: 80 }];

		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `Form7205-${certifiedBuilding.projectId}.xlsx`);
};

const getBuildingCode = (index) => {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const lettersCount = alphabet.length;

	let code = "";
	index++;

	while (index > 0) {
		let mod = (index - 1) % lettersCount;
		code = alphabet[mod] + code;
		index = Math.floor((index - 1) / lettersCount);
	}

	return code;
}