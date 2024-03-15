import { useState, useEffect } from "react";
import "./nuevocliente.css";
import CustomInputs from "../CustomInput/CustomInput";
import ManejodeErroresPre from "../../helpers/ManejodeErroresPre";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useHeight } from "../../hooks/useHookHeight";
import { useAppDispatch, useAppSelector } from "../../hooks/hooksRedux";
import {
  createClienteAsync,
  fetchClienteById,
  updateClienteAsync,
} from "../../redux/thunks/clientes/clientes.thunks";
import Button from "../ui/Button";
import { PrivateRoutes } from "../../models/enum/Route";

const NuevoCliente = () => {
  const navigate = useNavigate();
  const { screenHeight } = useHeight();

  const clienteById = useAppSelector((state) => state.clientes.dataById);
  const isLoading = useAppSelector((state) => state.clientes.loading);
  const dispatch = useAppDispatch();
  const { formErrors, setFormErrors } = ManejodeErroresPre();
  const params = useParams();
  useEffect(() => {
    dispatch(fetchClienteById(params.id ?? ""));
  }, []);

  const [formData, setFormData] = useState({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefonos: "",
    cliente_delegacion: "",
    cliente_estado: "",
    cliente_rfc: "",
    cliente_numero_clave: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any = {};

    if (formData.cliente_email === "") {
      errors.email = "El campo Email es obligatorio";
    }
    if (formData.cliente_nombre === "") {
      errors.nombre = "El campo Nombre es obligatorio";
    }
    // if (formData.cliente_rfc === '' || !rfcValido(formData.cliente_rfc, false)) {
    //   errors.rfc = 'Error en RFC';
    // }
    if (formData.cliente_telefonos === "") {
      errors.telefono = "El campo Teléfono es obligatorio";
    }
    // if (formData.cliente_numero_clave === '') {
    //   errors.codigoPostal = 'El campo Codigo Postal es obligatorio';
    // }
    if (formData.cliente_delegacion === "") {
      errors.city = "El campo City es obligatorio";
    }
    if (Object.keys(errors).length === 0) {
      if (params?.id !== undefined) {
        const newData = {
          ...formData,
        };

        const usuarioActualizado = dispatch(
          updateClienteAsync({ id: params.id, data: newData })
        );
        if ((await usuarioActualizado).payload) {
          toast.success("Cliente editado");
          navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LISTA_CLIENTE}`, {
            replace: true,
          });
        } else {
          toast.error("Error al editar el cliente");
        }
      } else {
        const nuevoClientes = {
          ...formData,
        };
        const nuevoClientesJSON = JSON.stringify(nuevoClientes);
        const clientes = dispatch(createClienteAsync(nuevoClientesJSON));
        if ((await clientes).payload) {
          toast.success("Creado");
          navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LISTA_CLIENTE}`, {
            replace: true,
          });
        } else {
          toast.error("Error al crear el cliente");
        }
      }
    } else {
      setFormErrors(errors);
    }
  };

  const initials = formData.cliente_nombre
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    if (params.id !== undefined) {
      setFormData({
        cliente_nombre: clienteById?.name || "no tiene",
        cliente_email: clienteById?.name || "no tiene",
        cliente_telefonos: clienteById?.telefono || "no tiene",
        cliente_rfc: clienteById?.rfc || "no tiene",
        cliente_delegacion: clienteById?.delegacion || "no tiene",
        cliente_numero_clave: clienteById?.clave || "no tiene",
        cliente_estado: clienteById?.estado || "no tiene",
      });
      return;
    }
    setFormData({
      cliente_nombre: "",
      cliente_email: "",
      cliente_telefonos: "",
      cliente_rfc: "",
      cliente_numero_clave: "",
      cliente_delegacion: "",
      cliente_estado: "",
    });
  }, [params.id, clienteById]);

  const handleBackNavigate = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="d-flex justify-content-center "></div>
      <form className="nuevoProducto mt-3" onSubmit={handleSubmit}>
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-12"
              style={{ maxHeight: `${screenHeight}px`, overflowY: "auto" }}
            >
              <div className="d-flex justify-content-between mt-5">
                <h3 className="title-producto mb-0">
                  {params.id !== undefined ? "Editar Cliente" : "Nuevo Cliente"}{" "}
                  {initials}
                </h3>
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleBackNavigate}
                  >
                    Back
                  </button>
                  <Button
                    type="submit"
                    buttonClassName={`bg-success text-white ${
                      isLoading
                        ? "disabled:pointer-events-none disabled:opacity-50"
                        : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
              <p className="descripcion-producto">
                {params.id === undefined
                  ? "Editar a un cliente a tu POS"
                  : "Agregar a un nuevo cliente a tu POS"}
              </p>
              <div>
                <div className="d-flex flex-column flex-md-row  gap-1">
                  <div className="d-flex flex-column col-md-4">
                    <CustomInputs
                      type="text"
                      label="Nombre"
                      name="name"
                      value={formData.cliente_nombre}
                      labelplace="Nombre"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...formData,
                          cliente_nombre: e.target.value,
                        });
                        setFormErrors({ ...formErrors, nombre: "" });
                      }}
                      error={formErrors.nombre}
                    />
                  </div>
                  <div className="d-flex flex-column col-md-4">
                    <CustomInputs
                      type="email"
                      label="Email"
                      name="email"
                      labelplace="a@example.com"
                      value={formData.cliente_email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...formData,
                          cliente_email: e.target.value,
                        });
                        setFormErrors({ ...formErrors, email: "" });
                      }}
                      error={formErrors.email}
                    />
                  </div>
                  <div className="d-flex flex-column col-md-4">
                    <CustomInputs
                      type="text"
                      label="RFC"
                      name="rfc"
                      labelplace="RFC"
                      value={formData.cliente_rfc}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFormData({
                          ...formData,
                          cliente_rfc: e.target.value,
                        });
                        setFormErrors({ ...formErrors, rfc: "" });
                      }}
                      error={formErrors.rfc}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row  gap-1 mt-4">
                <div className="d-flex flex-column col-md-4">
                  <CustomInputs
                    type="text"
                    label="Telefono"
                    name="telefono"
                    labelplace="Numero de Telefono"
                    value={formData.cliente_telefonos}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({
                        ...formData,
                        cliente_telefonos: e.target.value,
                      });
                      setFormErrors({ ...formErrors, telefono: "" });
                    }}
                    error={formErrors.telefono}
                  />
                </div>
                <CustomInputs
                  type="text"
                  label="City"
                  name="city"
                  labelplace="Ciudad"
                  value={formData.cliente_delegacion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      cliente_delegacion: e.target.value,
                    });
                    setFormErrors({ ...formErrors, city: "" });
                  }}
                  error={formErrors.city}
                />
              </div>
              <div className="d-flex flex-column flex-md-row  gap-2 mt-4">
                <div className="d-flex flex-column col-md-4">
                  <CustomInputs
                    type="text"
                    label="Codigo Postal"
                    name="codigoPostal"
                    labelplace="Codigo"
                    value={formData.cliente_numero_clave}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({
                        ...formData,
                        cliente_numero_clave: e.target.value,
                      });
                      setFormErrors({ ...formErrors, codigoPostal: "" });
                    }}
                    error={formErrors.codigoPostal}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end  mb-2">
              <Button
                type="submit"
                buttonClassName={`bg-success text-white ${
                  isLoading
                    ? "disabled:pointer-events-none disabled:opacity-50"
                    : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default NuevoCliente;
