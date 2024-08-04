import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useContext, useEffect } from "react";
import * as Yup from "yup";
import { VehicleContext } from "../../contexts/VehicleContext";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalContext } from "../../contexts/GlobalContext";
import { VehicleService } from "../../services/vehicle/vehicleService";
import { CustomError } from "../../utils/customError";
import { Vehicle } from "../../models/Vehicle";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";

const validationSchema = Yup.object().shape({
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.string().required("Year is required"),
    licensePlateNumber: Yup.string().required("License Plate Number is required"),
    rentalPrice: Yup.number().required("Rental Price is required"),
    availableStatus: Yup.string().required("Availability is required")
});

export default function EditVehicleDialog() {
    const vehicleService = new VehicleService();
    const { updateLoading, updateNotification } = useContext(GlobalContext);
    const {
        selectedVehicleId,
        isShowUpdateVehicleDialog,
        isCompletedEditVehicle,
        updateIsShowUpdateVehicleDialog,
        updateIsCompletedEditVehicle,
    } = useContext(VehicleContext);

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: {
        make: string;
        model: string;
        year: string;
        licensePlateNumber: string;
        rentalPrice: number;
        availableStatus: string;
    }): Promise<void> => {
        try {
            updateLoading(true);
            const vehicle: Vehicle = {
                vehicleId: selectedVehicleId,
                make: data.make,
                model: data.model,
                year: data.year,
                licensePlateNumber: data.licensePlateNumber,
                rentalPrice: data.rentalPrice,
                availableStatus: data.availableStatus,
            };
            await vehicleService.updateVehicleById(selectedVehicleId, vehicle);
            updateLoading(false);
            updateIsShowUpdateVehicleDialog(false);
            updateIsCompletedEditVehicle(true);
            updateNotification({
                status: "success",
                message: "Updated vehicle successfully",
            });
        } catch (error) {
            updateLoading(false);
            updateNotification({
                status: "error",
                message:
                    error instanceof CustomError
                        ? error.message
                        : "Unknow message",
            });
        }
    };

    const fetchVehicleById = async () => {
        try {
            updateLoading(true);
            const vehicle: Vehicle = await vehicleService.getVehicleById(selectedVehicleId);
            reset({
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                licensePlateNumber: vehicle.licensePlateNumber,
                rentalPrice: vehicle.rentalPrice,
                availableStatus: vehicle.availableStatus,
            });
            updateLoading(false);
        } catch (error) {
            updateLoading(false);
            updateNotification({
                status: "error",
                message:
                    error instanceof CustomError
                        ? error.message
                        : "Unknow message",
            });
        }
    };

    const handleClose = () => {
        reset();
        updateIsShowUpdateVehicleDialog(false);
    };

    useEffect(() => {
        fetchVehicleById();
    }, []);

    return (
        <>
            <Dialog
                open={isShowUpdateVehicleDialog}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: handleSubmit(onSubmit),
                    noValidate: true,
                    autoComplete: "off",
                }}
                sx={{
                    "& .MuiTextField-root": {
                        mt: 1,
                        mb: 1,
                        width: "100%",
                    },
                    mt: 10,
                    maxHeight: 600,
                }}
            >
                <DialogTitle>Edit Vehicle</DialogTitle>
                <DialogContent>
                    <div>
                    <Controller
                            name="make"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Make"
                                    placeholder="Enter your make"
                                    error={errors.make ? true : false}
                                    helperText={errors.make?.message}
                                />
                            )}
                        />
                        <Controller
                            name="model"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Model"
                                    type="model"
                                    placeholder="Enter your model"
                                    error={errors.model ? true : false}
                                    helperText={errors.model?.message}
                                />
                            )}
                        />
                        <Controller
                            name="year"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Year"
                                    type="year"
                                    placeholder="Enter year"
                                    error={
                                        errors.year ? true : false
                                    }
                                    helperText={errors.year?.message}
                                />
                            )}
                        />
                        <Controller
                            name="licensePlateNumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="License Plate Number"
                                    placeholder="Enter license plate number"
                                    error={errors.licensePlateNumber ? true : false}
                                    helperText={errors.licensePlateNumber?.message}
                                />
                            )}
                        />
                        <Controller
                            name="rentalPrice"
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Rental Price"
                                    placeholder="Enter rental price"
                                    error={errors.rentalPrice ? true : false}
                                    helperText={errors.rentalPrice?.message}
                                />
                            )}
                        />
                        <Controller
                            name="availableStatus"
                            control={control}
                            defaultValue="available"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Availability Status"
                                    placeholder="Enter availability status"
                                    error={errors.availableStatus ? true : false}
                                    helperText={errors.availableStatus?.message}
                                />
                            )}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}