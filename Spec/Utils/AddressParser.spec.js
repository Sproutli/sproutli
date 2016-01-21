import expect from 'expect';
import AddressParser from '../../App/Utils/AddressParser';

describe('AddressParser', () => {
  it('should be able to extract an address_line_1 from a place');
  it('should be able to parse an address with only a locality', () => {
    const testLocatility = 'Test Locality';
    const testLatLng = { lat: 123, lng: 123 };
    const testAddress = [
      { long_name: testLocatility, types: [ 'locality', 'political' ] },
      { long_name: 'Victoria', types: [ 'administrative_area_level_1', 'political' ] },
      { long_name: 'Australia', types: [ 'country', 'political' ] },
      { long_name: '3011', types: [ 'postal_code'] }
    ];

    const expectedAddress = AddressParser.parse(testAddress, testLatLng);
    
    expect(expectedAddress.locality).toEqual(testLocatility);
  });
});
