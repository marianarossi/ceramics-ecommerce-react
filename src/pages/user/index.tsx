// File: src/pages/UserPage.tsx
import { useState, useEffect } from "react";
import {
  MDBBtn,MDBListGroup,MDBTabsPane,  MDBTabsContent,MDBTabsLink,MDBTabsItem,MDBTabs,
  MDBListGroupItem,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol,
} from "mdb-react-ui-kit";
import { IAddress, IOrder, IUser } from "@/commons/interfaces.ts";
import userService from "@/service/user-service.ts";
import addressService from "@/service/address-service.ts";
import orderService from "@/service/order-service.ts";
import { AddAddressModal } from "@/components/add-address-modal";

export function UserPage() {
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [user, setUser] = useState<IUser | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<IAddress | undefined>(undefined);

  const handleJustifyClick = (value: string) => {
    if (value === justifyActive) return;
    setJustifyActive(value);
    window.location.hash = value;
  };

  const handleOpenModal = () => {
    setAddressToEdit(undefined);
    setModalOpen(true);
  };

  const handleEditAddress = (address: IAddress) => {
    setAddressToEdit(address);
    setModalOpen(true);
  };

  const handleDeleteAddress = async (address: IAddress) => {
    try {
      await addressService.remove(address);
      setAddresses((prev) => prev.filter((a) => a.id !== address.id));
    } catch (error) {
      console.error("An error occurred while deleting the address", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await userService.findAll();
      setUser(response.data[0]);
    } catch (error) {
      console.error("Error loading user data", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await addressService.findAll();
      setAddresses(response.data);
    } catch (error) {
      console.error("Error loading addresses", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderService.findAll();
      setOrders(response.data);
    } catch (error) {
      console.error("Error loading orders", error);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setJustifyActive(hash);
    }
    fetchUser();
    fetchAddresses();
    fetchOrders();
  }, []);

  const handleAddressSaved = () => {
    fetchAddresses();
  };

  return (
      <main>
        <div className="m-5">
          <MDBTabs pills justify className="mb-3">
            <MDBTabsItem>
              <MDBTabsLink
                  onClick={() => handleJustifyClick("tab1")}
                  active={justifyActive === "tab1"}
              >
                User Info
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                  onClick={() => handleJustifyClick("tab2")}
                  active={justifyActive === "tab2"}
              >
                Address Configuration
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                  onClick={() => handleJustifyClick("tab3")}
                  active={justifyActive === "tab3"}
              >
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
                    <p>
                      <strong>Name:</strong> {user.displayName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                    <p>
                      <strong>Birth Date:</strong> {user.birthDate}
                    </p>
                    <p>
                      <strong>Gender:</strong> {user.gender || "Not specified"}
                    </p>
                  </>
              ) : (
                  <p>Loading...</p>
              )}
              <MDBBtn color="primary">Edit Profile</MDBBtn>
            </MDBTabsPane>

            {/* Address Configuration Tab */}
            <MDBTabsPane open={justifyActive === "tab2"}>
              <h5>Saved Addresses</h5>
              <MDBListGroup>
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <MDBListGroupItem
                            key={address.id}
                            className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            {address.street}, {address.city}, {address.state} {address.zip}
                          </div>
                          <div className="d-flex">
                            <MDBBtn
                                className="me-2"
                                size="sm"
                                color="warning"
                                onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </MDBBtn>
                            <MDBBtn
                                size="sm"
                                color="danger"
                                onClick={() => handleDeleteAddress(address)}
                            >
                              Delete
                            </MDBBtn>
                          </div>
                        </MDBListGroupItem>
                    ))
                ) : (
                    <p>No addresses available.</p>
                )}
              </MDBListGroup>
              <MDBBtn color="success" className="mt-3" onClick={handleOpenModal}>
                Add New Address
              </MDBBtn>
            </MDBTabsPane>

            {/* Past Orders Tab */}
            <MDBTabsPane open={justifyActive === "tab3"}>
              <h5>Order History</h5>
              <MDBRow>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <MDBCol md="6" lg="4" className="mb-4" key={order.id}>
                          <MDBCard>
                            <MDBCardBody>
                              <MDBCardTitle>
                                Order Date:{" "}
                                {new Date(order.date).toLocaleDateString("en-GB")}
                              </MDBCardTitle>
                              <MDBCardText>
                                <strong>Shipping:</strong> ${order.shipping.toFixed(2)}
                                <br />
                                <strong>Status:</strong> {order.status}
                                <br />
                                <strong>Payment:</strong> {order.payment}
                                <br />
                                <strong>Items:</strong>
                                <ul>
                                  {order.items.map((item) => (
                                      <li key={item.productName}>
                                        <strong>Product Name:</strong> {item.productName}
                                        <br />
                                        <strong>Price:</strong> ${item.price.toFixed(2)}
                                        <br />
                                        <strong>Quantity:</strong> {item.quantity}
                                      </li>
                                  ))}
                                </ul>
                              </MDBCardText>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                    ))
                ) : (
                    <p>No past orders found.</p>
                )}
              </MDBRow>
            </MDBTabsPane>
          </MDBTabsContent>
        </div>

        {/* Reusable modal component */}
        <AddAddressModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onAddressSaved={handleAddressSaved}
            addressToEdit={addressToEdit}
        />
      </main>
  );
}
