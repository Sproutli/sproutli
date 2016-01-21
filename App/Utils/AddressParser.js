// @flow
// Find a specific property in the Google Places API result.
function findProperty(address: array, propertyName: string): ?string {
  const property = address.filter(a => a.types.indexOf(propertyName) > -1)[0]
  if (!property) { return null; }

  return property.long_name;
}

// Special Case for address_line_1, as we need to concatenate two properties.
function findAddressLine1(address: array): ?string {
  const streetNumber = findProperty(address, 'street_number');
  const route = findProperty(address, 'route');

  if (!streetNumber || !route) { return null; }

  return `${streetNumber} ${route}`;
}

// Parse an address result from the Google Places API.
const AddressParser = {
  parse(address: array, latlng: object): object { 
    return {
      location: `${latlng.lat}, ${latlng.lng}`,
      address_line_1: findAddressLine1(address),
      locality: findProperty(address, 'locality'),
      administrative_area_level_1: findProperty(address, 'administrative_area_level_1'),
      country: findProperty(address, 'country'),
      postcode: findProperty(address, 'postal_code')
    };
  }
};

export default AddressParser;
