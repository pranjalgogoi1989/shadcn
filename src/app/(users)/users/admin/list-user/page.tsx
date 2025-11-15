"use client";
import { DataTable } from '@/components/data-table'
import React from 'react';
import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface UserInfos {
  _id: string;
  image: string;
  name: string;
  email: string;
  plain_password: string;
  role: string;
  updatedAt: string;
}
const ListUsers = () => {
  const [users, setUsers] = useState<UserInfos[]>([]);
  useEffect(() => {
      fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);
  //console.log(users);
  const validKeys: (keyof UserInfos)[] = ["_id", "image","name", "email","plain_password", "role", "updatedAt"];
  const columnOrder: (keyof UserInfos)[] = ["_id","image", "name", "email", "plain_password", "role", "updatedAt"];

  const baseColumns: ColumnDef<UserInfos>[] =
    users.length > 0
      ? columnOrder
          .filter((key) => validKeys.includes(key)) 
          .map((key) => {
            if (key === "image") {
              return {
                accessorKey: key,
                header: "Avatar",
                cell: ({ row }) => (
                  <img
                    src={row.original.image}
                    alt={row.original.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ),
              };
            }
            return {
              accessorKey: key,
              header: key.charAt(0).toUpperCase() + key.slice(1),
            };
          })
      : [];
  

  const actionColumn: ColumnDef<UserInfos> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userid = row.original._id; // full row data
      return (
        <div className="flex gap-2">
         
          <a href={`/users/admin/list-user/${userid}`}>
            <Button size="sm" variant="default">
              Profile
            </Button>
          </a>
         
        </div>
      );
    },
  };

  const finalcolumns = [...baseColumns, actionColumn];

  return (
    <div className="flex flex-1 flex-col">
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={users} columns={finalcolumns} />
        </div>
      </div>
    </div>
  )
}

export default ListUsers