import dayjs from "dayjs";
import React from "react";
import "./App.css";
import { useData } from "./hooks/use-data";

import { Select, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { DatePicker } from "antd";

import { Input } from "antd";
import {
  DEFAULT_DATE_RANGE,
  DEFAULT_PAGE_SIZE,
  PAYMENT_ENDPOINT,
  USER_ENDPOINT,
} from "./constants";
import { Payment, PaymentResponse, UserResponse } from "./helper-types";
import { deduceFlag, formattedAmount } from "./utils";

const { RangePicker } = DatePicker;
const { Search } = Input;

// This lives outside of the component, as it does not need to be recreated on every render and save some fps
const columns: ColumnsType<Payment> = [
  {
    title: "Payment Ref ID",
    dataIndex: "paymentRefId",
    key: "paymentRefId",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, record) => <p>{new Date(record.date).toLocaleString()}</p>,
  },
  {
    title: "Amount 💰",
    dataIndex: "amount",
    key: "amount",
    render: (_, record) => formattedAmount(record.amount, record.currency),
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency",
    render: (_, record) => <p>{deduceFlag(record.currency)}</p>,
  },

  {
    title: "Customer",
    key: "customer.companyName",
    render: (_, record) => <p>{record.customer.companyName}</p>,
  },
];

export function Payments() {
  /**
   * Filters
   */
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE, // Items per page
  });

  const [customerFilter, setCustomerFilter] = React.useState<
    string | undefined
  >(undefined);

  const [dateRange, setDateRange] = React.useState<
    { from: string; to: string } | undefined
  >(undefined);

  const [paymentRef, setPaymentRef] = React.useState<string | undefined>(
    undefined
  );

  /**
   * Data fetching
   */
  const { data, isLoading, error } = useData<PaymentResponse>(
    PAYMENT_ENDPOINT,
    {
      page: pagination.current,
      perPage: pagination.pageSize,
      customerFilter,
      paymentRef,
      from: dateRange?.from ?? undefined,
      to: dateRange?.to ?? undefined,
    }
  );

  const { data: userInfo, isLoading: userInfoLoading } =
    useData<UserResponse>(USER_ENDPOINT);

  /**
   * Handlers for the filters
   */

  const handleDateRangeChange = React.useCallback(
    (values: [dayjs.Dayjs, dayjs.Dayjs]) => {
      if (values) {
        const [startDate, endDate] = values;
        const formattedStartDate = startDate.format("YYYY-MM-DD");
        const formattedEndDate = endDate.format("YYYY-MM-DD");

        // check if both have changed, not just one
        if (
          formattedStartDate !== dateRange?.from &&
          formattedEndDate !== dateRange?.to
        ) {
          setDateRange({
            from: formattedStartDate,
            to: formattedEndDate,
          });
        }
      } else {
        setDateRange(undefined);
      }
    },
    [dateRange]
  );

  // save it here to avoid recreating this if userInfo is the same
  const selectableCustomers = React.useMemo(() => {
    return userInfo?.user.customers.map((customer) => ({
      value: customer.id,
      label: customer.companyName,
    }));
  }, [userInfo]);

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading || userInfoLoading) {
    return <Spin />;
  }

  /**
   * Rendering the table and all the filters needed
   */

  return (
    <div className="Main">
      <div className="FiltersMain">
        <Search
          placeholder="Search by payment REF"
          allowClear
          enterButton="Search"
          size="large"
          value={paymentRef}
          onSearch={(paymentRef) => {
            // if no payments ref, reset the filter
            if (paymentRef === "") {
              setPaymentRef(undefined);
            } else {
              setPaymentRef(paymentRef);
            }
          }}
        />

        <div className="Filters">
          <RangePicker
            onChange={(values) => {
              // I could not import the type from antd, but this should be the correct one
              handleDateRangeChange(values as [dayjs.Dayjs, dayjs.Dayjs]);
            }}
            value={
              dateRange
                ? [
                    dayjs(dateRange?.from, DEFAULT_DATE_RANGE),
                    dayjs(dateRange?.to, DEFAULT_DATE_RANGE),
                  ]
                : undefined
            }
          />
          <Select
            showSearch
            placeholder="Select a customer"
            optionFilterProp="children"
            onChange={(newValue: string) => {
              setCustomerFilter(newValue);

              // reset the page number too
              setPagination({ ...pagination, current: 1 });
            }}
            value={customerFilter}
            allowClear
            options={selectableCustomers}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.payments ?? []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.total ?? 0,
        }}
        onChange={(newPagination) =>
          setPagination({
            current: newPagination.current ?? 1,
            pageSize: newPagination.pageSize ?? DEFAULT_PAGE_SIZE,
          })
        }
      />
    </div>
  );
}
