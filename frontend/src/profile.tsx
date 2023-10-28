import "./App.css";
import { UserResponse } from "./helper-types";
import { useData } from "./hooks/use-data";
export function Profile() {
  const { data, isLoading, error } = useData<UserResponse>(
    "http://localhost:3000/api/v1/users/me",
    {}
  );

  if (isLoading) {
    return <p>still loading</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="Profile">
      <h1>Welcome {data?.user.username ?? ""}</h1>

      <h3>My customers</h3>

      {data?.user.customers.map((customer: any) => (
        <p key={customer.id}>{customer.companyName}</p>
      )) ?? []}
    </div>
  );
}
