import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import * as ExcelJS from "exceljs";
import { Response } from "express";
import { WorkSheet, utils } from "xlsx";
import { Sequelize } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    const newCustomer = new CreateCustomerDto();
    const customer = await this.customerModel.create(newCustomer)
    return await this.userModel.create(createUserDto)
  }

  generateExcelFile = async (response: Response) => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    const secondSheet = workbook.addWorksheet("Sheet2");

    const STATE_LIST = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
      "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
      "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
      "Delhi (National Capital Territory of Delhi)", "Puducherry"
  ]
  STATE_LIST.forEach((value, index) => {
        const rowNumber = index + 1;
        secondSheet.getCell(`A${rowNumber}`).value = value;
    });

    const headerRow = [
        "CUSTOMER NAME",
        "CUSTOMER EMAIL",
        "CUSTOMER ADDRESS",
        "MOBILE NUMBER",
        "PRODUCT NAME",
        "TOTAL AMOUNT",
        "DISCOUNT",
        "STATE",
        "CITY",
        "PIN CODE",
    ];

    worksheet.addRow(headerRow);
    const header = worksheet.getRow(1);

    const stateSize = secondSheet.getColumn(1).values;

    header.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "090f63" }, // Set the header color (light gray in this example)
        };
        cell.font = {
            color: { argb: "ffffff" },
            bold: true,
        };

        if (cell.value == "STATE") {
          let i = 2;
          console.log(cell.address);
          while (i < 100) {
              const customerTypeCell = worksheet.getCell(`${cell.address.charAt(0)}${i}`);
              customerTypeCell.dataValidation = {
                  type: "list",
                  allowBlank: true,
                  formulae: [`Sheet2!$A$1:$A$${stateSize.length}`],
              };
              i++;
          }
      }
    });

    const createSheet1 = workbook.getWorksheet("Sheet1");
    const createSheet2 = workbook.getWorksheet("Sheet2");

    if (worksheet) {
        createSheet1.columns.forEach((column, index) => {
            column.width = 25; // Default width is 10 if not specified in columnWidths

            createSheet1.eachRow((row, rowNumber) => {
                row.height = 25; // Set the height of each row to 30
            });

            // Iterate through each data row in the worksheet
            for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
                const cell = worksheet.getCell(rowNumber, index + 1);
                cell.alignment = { horizontal: "center", vertical: "middle" };
            }
        });
    }

    createSheet2.state = "hidden";

    // Add data to the worksheet, you can customize this based on your data.

    // Set the content type and attachment header for the response.
    response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=Customer-file.xlsx");

    // Pipe the workbook to the response stream.
    return workbook.xlsx.write(response);
};

getCellValueFor(sheet: WorkSheet, colNumber: number, rowNumber: number): string {
  return sheet[utils.encode_cell({ c: colNumber, r: rowNumber })]?.v ?? "";
}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}