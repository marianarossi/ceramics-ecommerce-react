import { useState, useEffect } from "react";
import { MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBBtn, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import {IAddress, IOrder, IUser} from "@/commons/interfaces.ts";
import userService from "@/service/user-service.ts";
import addressService from "@/service/address-service.ts";
import orderService from "@/service/order-service.ts"; // Adjust this import based on your file structure

export function UserPage() {
  const [justifyActive, setJustifyActive] = useState('tab1');
  const [user, setUser] = useState<IUser | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);

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
                          <MDBBtn size="sm" color="warning">Edit</MDBBtn>
                        </MDBListGroupItem>
                    ))
                ) : (
                    <p>No addresses available.</p>
                )}
              </MDBListGroup>
              <MDBBtn color="success" className="mt-3">Add New Address</MDBBtn>
            </MDBTabsPane>

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
      </main>
  );
}
