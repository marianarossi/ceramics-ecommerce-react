import { useState, useEffect } from "react";
import {
  MDBBtn,MDBListGroup,MDBTabsPane,  MDBTabsContent,MDBTabsLink,MDBTabsItem,MDBTabs,
  MDBListGroupItem,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol,
} from "mdb-react-ui-kit";
import { IAddress, IOrder, IUser } from "@/commons/interfaces.ts";
import userService from "@/service/user-service.ts";
import addressService from "@/service/address-service.ts";
import orderService from "@/service/order-service.ts";
import { AddAddressModal } from "@/components/address-modal";
import { UserEditModal } from "@/components/user-modal";
import {useToast} from "@chakra-ui/react";

export function UserPage() {
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [user, setUser] = useState<IUser | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<IAddress | undefined>(undefined);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const toast = useToast();

  const handleUserEditClick = (user: IUser | null) => {
    setUserToEdit(user);
    setUserModalOpen(true);
  };

  const handleUserSaved = (updatedUser: IUser) => {
    setUser(updatedUser);
    setUserModalOpen(false);
  };

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
    // First, check if any order is using this address
    const isAddressUsed = orders.some(order => order.address.id === address.id);
    if (isAddressUsed) {
      toast({
        title: 'Cannot delete address.',
        description: 'There is an order placed with this address.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
      const response = await addressService.remove(address);
      if (response.status === 200) {
        // Only remove the address from state if deletion was successful
        setAddresses(prev => prev.filter(a => a.id !== address.id));
      } else {
        toast({
          title: 'Deletion failed',
          description: 'The address could not be deleted. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        });
      }
    } catch (error) {
      // Catch any error returned from the backend and notify the user
      toast({
        title: 'Deletion error',
        description: 'This address is associated with an order and cannot be deleted.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
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
                      <strong>SSN:</strong> {user.ssn}
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
              <button onClick={() => handleUserEditClick(user)} className="btn btn-warning">
                Edit
              </button>
            </MDBTabsPane>

            {/* Address Configuration Tab */}
            <MDBTabsPane open={justifyActive === "tab2"}>
              <h5>Saved Addresses</h5>
              <MDBListGroup>
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <MDBListGroupItem key={address.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            {address.street}, {address.city}, {address.state} {address.zip}
                          </div>
                          <div className="d-flex">
                            <MDBBtn className="me-2" size="sm" color="warning" onClick={() => handleEditAddress(address)}>
                              Edit
                            </MDBBtn>
                            <MDBBtn size="sm" color="danger" onClick={() => handleDeleteAddress(address)}>
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
                                Order Date: {new Date(order.date).toLocaleDateString("en-GB")}
                              </MDBCardTitle>
                              <MDBCardText>
                                <strong>Total:</strong> ${order.total.toFixed(2)}
                                <br />
                                <strong>Shipping:</strong> ${order.shipping.toFixed(2)}
                                <br />
                                <strong>Status:</strong> {order.status}
                                <br />
                                <strong>Payment:</strong> {order.payment}
                                <br />
                                <strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}
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

        {/* Address Modal */}
        <AddAddressModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onAddressSaved={handleAddressSaved}
            addressToEdit={addressToEdit}
        />

        {/* User Modal */}
        <UserEditModal
            modalOpen={userModalOpen}
            setModalOpen={setUserModalOpen}
            onUserSaved={handleUserSaved}
            userToEdit={userToEdit}
        />
      </main>
  );
}
