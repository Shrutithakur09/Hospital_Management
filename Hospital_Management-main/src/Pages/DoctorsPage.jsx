// src/Pages/DoctorsPage.jsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

function DoctorsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await api.get("/api/doctors");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading doctors...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Doctors List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Specialization</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doc, index) => (
            <tr key={doc._id}>
              <td>{index + 1}</td>
              <td>{doc.name}</td>
              <td>{doc.specialization}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorsPage;
