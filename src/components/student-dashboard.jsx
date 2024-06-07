import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";

import { useSession } from "next-auth/react";

const StudentDashboard = () => {
  const { data: session } = useSession();
  const [makeupRequests, setMakeupRequests] = useState([]);

  async function getMyRequests(myEmail) {
    const response = await fetch("/api/fetch-my-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ myEmail, session }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch makeup requests");
    }

    const data = await response.json();
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a["submission-time"]);
      const dateB = new Date(b["submission-time"]);
      return dateB - dateA;
    });
    setMakeupRequests(sortedData);
  }

  useEffect(() => {
    if (session) {
      getMyRequests(session?.user?.email);
    }
  }, [session]);

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleString("en-GB", options);
  }

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // Hardcoded to 10 entries per page. TODO: User defined

  const pages = Math.ceil(makeupRequests.length / rowsPerPage);

  const paginatedRequests = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return makeupRequests.slice(start, end);
  }, [page, makeupRequests]);
  return (
    <div>
      <h1 className="font-semibold my-4 italic text-center">
        {session?.user?.name}'s Student Dashboard
      </h1>
      <Table
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader className="items-center justify-center flex">
          <TableColumn title="Name" className="text-center" />
          <TableColumn title="ID Number" className="text-center" />
          <TableColumn title="Course Code" className="text-center" />
          <TableColumn title="Evaluative Component" className="text-center" />
          <TableColumn title="Reason" className="text-center" />
          <TableColumn title="Submitted At" className="text-center" />
          <TableColumn title="Attachments" className="text-center" />
          <TableColumn title="Status" className="text-center" />
        </TableHeader>
        <TableBody items={paginatedRequests}>
          {paginatedRequests.map((request, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{request.name}</TableCell>
              <TableCell className="text-center">{request.idNumber}</TableCell>
              <TableCell className="text-center">
                {request.courseCode}
              </TableCell>
              <TableCell className="text-center">
                {request.evalComponent}
              </TableCell>
              <TableCell className="text-center">{request.reason}</TableCell>
              <TableCell className="text-center">
                {formatDateTime(request["submission-time"])}
              </TableCell>
              <TableCell className="text-center">
                <Button size="sm" radius="full" variant="light" color="primary">
                  View Attachments
                </Button>
              </TableCell>
              <TableCell className="text-center">{request.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentDashboard;
