import { useState, useEffect } from "react";
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBInput,
    MDBModalTitle,
} from "mdb-react-ui-kit";
import addressService from "@/service/address-service.ts";
import { ButtonWithProgress } from "@/components/button-with-progress";
import { IAddress } from "@/commons/interfaces.ts";

// Define a specific type for your address errors.
interface AddressErrors {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

interface AddAddressModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    onAddressSaved: () => void;
    addressToEdit?: IAddress;
}

export function AddAddressModal({
                                    modalOpen,
                                    setModalOpen,
                                    onAddressSaved,
                                    addressToEdit,
                                }: AddAddressModalProps) {
    const [newAddress, setNewAddress] = useState<IAddress>({
        street: "",
        number: "" as unknown as number,
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        zip: "",
    });

    // Use the AddressErrors type in state.
    const [addressErrors, setAddressErrors] = useState<AddressErrors>({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        zip: "",
    });

    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [apiSuccess, setApiSuccess] = useState(false);

    useEffect(() => {
        if (addressToEdit) {
            setNewAddress(addressToEdit);
        } else {
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
        }
    }, [addressToEdit]);

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
        setAddressErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleZipBlur = async () => {
        if (newAddress.zip.length === 8) {
            const addressData = await addressService.getAddressByCEP(newAddress.zip);
            if (addressData) {
                setNewAddress((prev) => ({
                    ...prev,
                    street: addressData.logradouro,
                    neighborhood: addressData.bairro,
                    city: addressData.localidade,
                    state: addressData.uf,
                    country: "Brasil",
                }));
            }
        }
    };

    // Validation function using the AddressErrors type.
    const validate = (): boolean => {
        const errors: AddressErrors = {
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            country: "",
            zip: "",
        };

        // Validate ZIP code: must be exactly 8 digits.
        const zipDigits = newAddress.zip.replace(/\D/g, "");
        if (zipDigits.length !== 8) {
            errors.zip = "ZIP code must be exactly 8 digits";
        }

        // Validate Number: must not be empty and must be a valid number.
        if (!newAddress.number || isNaN(Number(newAddress.number))) {
            errors.number = "Number must be a valid numeric value";
        }

        // Optionally validate other required fields.
        if (!newAddress.street.trim()) {
            errors.street = "Street is required";
        }
        if (!newAddress.city.trim()) {
            errors.city = "City is required";
        }
        if (!newAddress.state.trim()) {
            errors.state = "State is required";
        }
        if (!newAddress.country.trim()) {
            errors.country = "Country is required";
        }

        setAddressErrors(errors);

        // If there are no errors (all values are empty strings), return true.
        return Object.values(errors).every((error) => error === "");
    };

    const handleSaveAddress = async () => {
        // Run client-side validation first.
        if (!validate()) {
            return;
        }

        setPendingApiCall(true);
        setApiError(false);
        setApiSuccess(false);

        const addressToSave = {
            ...newAddress,
            // Convert the number field from string to number.
            number: parseInt(newAddress.number as unknown as string) || 0,
        };

        let response;
        if (newAddress.id) {
            response = await addressService.update(addressToSave);
        } else {
            response = await addressService.save(addressToSave);
        }

        if (response.status === 200 || response.status === 201) {
            setApiSuccess(true);
            setTimeout(() => {
                setModalOpen(false);
                onAddressSaved();
            }, 2000);
        } else {
            if (response.data.validationErrors) {
                setAddressErrors(response.data.validationErrors);
            }
            setApiError(true);
            setPendingApiCall(false);
        }
    };

    return (
        <MDBModal open={modalOpen} setOpen={setModalOpen} tabIndex="-1">
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>
                            {addressToEdit ? "Edit Address" : "Add New Address"}
                        </MDBModalTitle>
                        <MDBBtn
                            className="btn-close"
                            color="none"
                            onClick={() => setModalOpen(false)}
                        ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBInput
                            className={`mb-3 ${addressErrors.zip ? "is-invalid" : ""}`}
                            label="ZIP Code"
                            value={newAddress.zip.replace(/\D/g, "")}
                            onChange={handleAddressChange}
                            onBlur={handleZipBlur}
                            name="zip"
                        />
                        {addressErrors.zip && (
                            <div className="invalid-feedback">{addressErrors.zip}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.street ? "is-invalid" : ""}`}
                            label="Street"
                            value={newAddress.street}
                            onChange={handleAddressChange}
                            name="street"
                        />
                        {addressErrors.street && (
                            <div className="invalid-feedback">{addressErrors.street}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.number ? "is-invalid" : ""}`}
                            label="Number"
                            type="number"
                            value={
                                typeof newAddress.number === "number"
                                    ? newAddress.number === 0
                                        ? ""
                                        : newAddress.number.toString()
                                    : newAddress.number
                            }
                            onChange={handleAddressChange}
                            name="number"
                        />
                        {addressErrors.number && (
                            <div className="invalid-feedback">{addressErrors.number}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.complement ? "is-invalid" : ""}`}
                            label="Complement"
                            value={newAddress.complement}
                            onChange={handleAddressChange}
                            name="complement"
                        />
                        {addressErrors.complement && (
                            <div className="invalid-feedback">{addressErrors.complement}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.neighborhood ? "is-invalid" : ""}`}
                            label="Neighborhood"
                            value={newAddress.neighborhood}
                            onChange={handleAddressChange}
                            name="neighborhood"
                        />
                        {addressErrors.neighborhood && (
                            <div className="invalid-feedback">{addressErrors.neighborhood}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.city ? "is-invalid" : ""}`}
                            label="City"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            name="city"
                        />
                        {addressErrors.city && (
                            <div className="invalid-feedback">{addressErrors.city}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.state ? "is-invalid" : ""}`}
                            label="State"
                            value={newAddress.state}
                            onChange={handleAddressChange}
                            name="state"
                        />
                        {addressErrors.state && (
                            <div className="invalid-feedback">{addressErrors.state}</div>
                        )}
                        <MDBInput
                            className={`mb-3 ${addressErrors.country ? "is-invalid" : ""}`}
                            label="Country"
                            value={newAddress.country}
                            onChange={handleAddressChange}
                            name="country"
                        />
                        {addressErrors.country && (
                            <div className="invalid-feedback">{addressErrors.country}</div>
                        )}
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={() => setModalOpen(false)}>
                            Close
                        </MDBBtn>
                        <ButtonWithProgress
                            disabled={pendingApiCall}
                            pendingApiCall={pendingApiCall}
                            className="btn btn-primary"
                            text={addressToEdit ? "Save Changes" : "Save Address"}
                            onClick={handleSaveAddress}
                        />
                    </MDBModalFooter>
                    {apiError && (
                        <div className="alert alert-danger">Failed to save address!</div>
                    )}
                    {apiSuccess && (
                        <div className="alert alert-success">
                            Address saved successfully!
                        </div>
                    )}
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
}
