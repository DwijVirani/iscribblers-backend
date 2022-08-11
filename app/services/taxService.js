const Tax = require('../models/tax');
const { TAX_TYPES } = require('./../config/constants');

const getGSTGroup = (taxList, taxName, description, tax_rate) => {
  if (!taxList || !taxName || !tax_rate) return;
  const groupTaxes = taxList
    .filter(
      (x) =>
        (x.type === TAX_TYPES.CGST && x.tax_rate === tax_rate) ||
        (x.type === TAX_TYPES.SGST && x.tax_rate === tax_rate),
    )
    .map((x) => x.id);
  const item = {
    name: taxName,
    description,
    tax_rate: tax_rate * 2,
    is_group: true,
    group_taxes: groupTaxes,
    type: TAX_TYPES.GROUP,
  };
  return item;
};

class TaxService {
  async create() {
    const defaultTaxes = require('./../data/defaultTaxes.json').map((item) => {
      return {
        ...item,
      };
    });
    await Tax.create(defaultTaxes);
    const taxes = await Tax.find({});
    const groups = [];
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 0.05 + SGST 0.05', 0.05));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 0.125 + SGST 0.125', 0.125));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 1.25 + SGST 1.25', 1.25));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 1.5 + SGST 1.5', 1.5));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 2.5 + SGST 2.5', 2.5));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 6 + SGST 6', 6));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 9 + SGST 9', 9));
    groups.push(getGSTGroup(taxes, 'GST', 'CGST 14 + SGST 14', 14));
    await Tax.create(groups);
  }
}
const taxService = new TaxService();
module.exports = taxService;
