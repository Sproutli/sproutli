// @flow
function findProperty(address: array, propertyName: string): ?string {
  const property = address.filter(a => a.types.indexOf(propertyName) > -1)[0]
  if (!property) { return null; }

  return property.long_name;
}

const AddressParser = {
  parse(address, latlng) { 
    const address_line_1 = [findProperty(address, 'street_number'), findProperty(address, 'route')].join(' ');
    return {
      location: `${latlng.lat}, ${latlng.lng}`,
      address_line_1,
      locality: findProperty(address, 'locality'),
      administrative_area_level_1: findProperty(address, 'administrative_area_level_1'),
      country: findProperty(address, 'country'),
      postcode: findProperty(address, 'postal_code')
    };
  }
};

export default AddressParser;
