import expect from 'expect';
import AddressParser from '../../App/Utils/AddressParser';

describe('AddressParser', () => {
  const testLatLng = { lat: 123, lng: 123 };

  it('should be able to extract an address_line_1 from a place', () => {
    const testStreetNumber = 'Test Street Number';
    const testRoute = 'Test Route';
    const testAddress = [
      { long_name: testStreetNumber, types: [ 'street_number' ] },
      { long_name: testRoute, types: [ 'route' ] },
      { long_name: 'Locality', types: [ 'locality', 'political' ] },
      { long_name: 'Victoria', types: [ 'administrative_area_level_1', 'political' ] },
      { long_name: 'Australia', types: [ 'country', 'political' ] },
      { long_name: '3011', types: [ 'postal_code'] }
    ];

    const actualAddressLine1 = AddressParser.parse(testAddress, testLatLng).address_line_1;
    const expectedAddressLine1 = `${testStreetNumber} ${testRoute}`;

    expect(actualAddressLine1).toEqual(expectedAddressLine1);

  });

  it('should be able to parse an address with only a locality', () => {
    const expectedLocality = 'Test Locality';
    const testAddress = [
      { long_name: expectedLocality, types: [ 'locality', 'political' ] },
      { long_name: 'Victoria', types: [ 'administrative_area_level_1', 'political' ] },
      { long_name: 'Australia', types: [ 'country', 'political' ] },
      { long_name: '3011', types: [ 'postal_code'] }
    ];

    const actualLocality = AddressParser.parse(testAddress, testLatLng).locality;
    
    expect(actualLocality).toEqual(expectedLocality);
  });
});
