import { useState, useEffect } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBModalContent, MDBModalHeader, MDBModalBody, MDBModal, MDBModalDialog, MDBModalTitle, MDBInput, MDBModalFooter
} from "mdb-react-ui-kit";
import {IAddress, IOrder, IUser} from "@/commons/interfaces.ts";
import userService from "@/service/user-service.ts";
import addressService from "@/service/address-service.ts";
import orderService from "@/service/order-service.ts";
import {ButtonWithProgress} from "@/components/button-with-progress"; // Adjust this import based on your file structure

export function UserPage() {
  const [justifyActive, setJustifyActive] = useState('tab1');
  const [user, setUser] = useState<IUser | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({
    street: '',
    number: '' as unknown as number,
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    zip: ''
  });

  const handleJustifyClick = (value: string) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.findAll();
        setUser(response.data[0]);
        console.log(response.data);
      } catch (error) {
        console.error("An error occurred while loading the user data", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await addressService.findAll();
        setAddresses(response.data);
        console.log(response.data);

      } catch (error) {
        console.error("An error occurred while loading the addresses", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await orderService.findAll();
        setOrders(response.data);
        console.log(response.data);

      } catch (error) {
        console.error("An error occurred while loading the orders", error);
      }
    };

    fetchUser();
    fetchAddresses();
    fetchOrders();

  }, []);

  const handleSaveAddress = async () => {
    setPendingApiCall(true);
    setApiError(false);
    setApiSuccess(false);

      const addressToSave = {
        ...newAddress,
        number: parseInt(newAddress.number as unknown as string) || 0 // Convert to number, default to 0 if empty
      };
      const response = await addressService.save(addressToSave);
      if (response.status === 200 || response.status === 201) {
        setApiSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setNewAddress({
            street: "",
            number: "" as unknown as number,
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            country: "",
            zip: "",
          });
        }, 2000);
      } else {
        setApiError(true);
        setPendingApiCall(false);
      }
  }

  const handleZipBlur = async () => {
    if (newAddress.zip.length === 8) {
      const addressData = await addressService.getAddressByCEP(newAddress.zip);
      if (addressData) {
        setNewAddress((prevAddress) => ({
          ...prevAddress,
          street: addressData.logradouro,
          neighborhood: addressData.bairro,
          city: addressData.localidade,
          state: addressData.uf,
          country: "Brasil",
        }));
      }
    }
  };

  return (
      <main>
        <div className="m-5">
          <MDBTabs pills justify className="mb-3">
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleJustifyClick("tab1")} active={justifyActive === "tab1"}>
                User Info
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleJustifyClick("tab2")} active={justifyActive === "tab2"}>
                Address Configuration
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleJustifyClick("tab3")} active={justifyActive === "tab3"}>
                Past Orders
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            {/* User Info Tab */}
            <MDBTabsPane open={justifyActive === "tab1"}>
              <h5>User Details</h5>
              {user ? (
                  <>
                    <p><strong>Name:</strong> {user.displayName}</p>
                    <p><strong>Email:</strong> {user.email}</p> {/* Email */}
                    <p><strong>Phone:</strong> {user.phone}</p> {/* Phone */}
                    <p><strong>Birth Date:</strong> {user.birthDate}</p> {/* Birth Date */}
                    <p><strong>Gender:</strong> {user.gender || "Not specified"}</p> {/* Gender */}
                  </>
              ) : (
                  <p>Loading...</p>
              )}
              <MDBBtn color="primary">Edit Profile</MDBBtn>
            </MDBTabsPane>

            <MDBTabsContent>
              <MDBTabsPane open={justifyActive === "tab2"}>
                <h5>Saved Addresses</h5>
                <MDBListGroup>
                  {addresses.length > 0 ? (
                      addresses.map((address) => (
                          <MDBListGroupItem key={address.id} className="d-flex justify-content-between align-items-center">
                            <div>
                              {address.street}, {address.city}, {address.state} {address.zip}
                            </div>
                            <MDBBtn size="sm" color="warning">Edit</MDBBtn>
                          </MDBListGroupItem>
                      ))
                  ) : (
                      <p>No addresses available.</p>
                  )}
                </MDBListGroup>
                <MDBBtn color="success" className="mt-3" onClick={() => setModalOpen(true)}>Add New Address</MDBBtn>
              </MDBTabsPane>
            </MDBTabsContent>

            {/* Past Orders Tab */}
            <MDBTabsPane open={justifyActive === "tab3"}>
              <h5>Order History</h5>
              <MDBListGroup>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <MDBListGroupItem key={order.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Order #{order.id}</strong> - {order.date} - {order.status}
                          </div>
                          <MDBBtn size="sm" color="info">View Details</MDBBtn>
                        </MDBListGroupItem>
                    ))
                ) : (
                    <p>No past orders found.</p>
                )}
              </MDBListGroup>
            </MDBTabsPane>
          </MDBTabsContent>
        </div>

        {/* Modal for adding new address */}
        <MDBModal open={modalOpen} setOpen={setModalOpen} tabIndex='-1'>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Add New Address</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={() => setModalOpen(false)}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBInput className="mb-3" label="ZIP Code"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                          onBlur={handleZipBlur} // Fetches address on ZIP input blur
                />
                <MDBInput className="mb-3" label="Street"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
                <MDBInput className="mb-3" label="Number" type="number"
                          value={newAddress.number}
                          onChange={(e) => setNewAddress({ ...newAddress, number: parseInt(e.target.value) })}
                />
                <MDBInput className="mb-3" label="Complement"
                          value={newAddress.complement}
                          onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                />
                <MDBInput className="mb-3" label="Neighborhood"
                          value={newAddress.neighborhood}
                          onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                />
                <MDBInput className="mb-3" label="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <MDBInput className="mb-3" label="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <MDBInput className="mb-3" label="Country"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={() => setModalOpen(false)}>Close</MDBBtn>
                <ButtonWithProgress
                    disabled={pendingApiCall}
                    pendingApiCall={pendingApiCall}
                    className="btn btn-primary"
                    text="Save Address"
                    onClick={handleSaveAddress}
                />
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>

      </main>
  );
}
