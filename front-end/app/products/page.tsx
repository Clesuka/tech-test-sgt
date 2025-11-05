"use client";

import api from "@/lib/api";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;

interface Product {
  id: string;
  product_title: string;
  price: number;
  product_category?: string;
  product_description?: string;
  image_url?: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm();

  // Debounce searchTerm -> debouncedSearch with 300ms
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset pagination when search changes
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, debouncedSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pageSize,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await api.get("/web/v1/products", { params });
      const data = res.data;

      // Support different response shapes
      if (Array.isArray(data)) {
        setProducts(data);
        setTotal(data.length);
      } else if (data && data.data) {
        setProducts(data.data);
        setTotal(data.total ?? data.count ?? data.data.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error("Fetch products error:", error);
      message.error(
        error?.response?.data?.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalType("create");
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Product) => {
    setModalType("edit");
    setEditingProduct(record);
    form.setFieldsValue({
      product_title: record.product_title,
      price: record.price,
      product_description: record.product_description,
      product_category: record.product_category,
      image_url: record.image_url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (record: Product) => {
    Modal.confirm({
      title: "Delete product",
      content: `Are you sure you want to delete "${record.product_title}"?`,
      onOk: async () => {
        try {
          await api.delete("/web/v1/product", {
            params: { product_id: record.id },
          });
          message.success("Product deleted");
          fetchProducts();
        } catch (error: any) {
          console.error("Delete error:", error);
          message.error(
            error?.response?.data?.message || "Failed to delete product"
          );
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === "create") {
        await api.post("/web/v1/product", values);
        message.success("Product created");
      } else if (modalType === "edit" && editingProduct) {
        await api.put("/web/v1/product", {
          product_id: editingProduct.id,
          ...values,
        });
        message.success("Product updated");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Save product error:", error);
      message.error(error?.response?.data?.message || "Failed to save product");
    }
  };

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "Product Title",
        dataIndex: "product_title",
        key: "product_title",
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (value: number) => `$${Number(value).toFixed(2)}`,
      },
      {
        title: "Category",
        dataIndex: "product_category",
        key: "product_category",
      },
      {
        title: "Description",
        dataIndex: "product_description",
        key: "product_description",
        ellipsis: true,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div className="flex items-center justify-between">
          <Title level={3}>Products</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Search
            placeholder="Search products"
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 400 }}
          />
          <div />
        </div>

        <Table<Product>
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={false}
          rowKey={(record) => record.id}
          bordered
        />

        <div className="flex justify-end pt-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps || pageSize);
            }}
            showSizeChanger
          />
        </div>
      </Space>

      <Modal
        title={modalType === "create" ? "Create Product" : "Edit Product"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="product_title"
            label="Product Title"
            rules={[
              { required: true, message: "Please enter a product title" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter a price" },
              { type: "number", message: "Price must be a number" },
            ]}
            getValueFromEvent={(e) => Number(e.target.value)}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="product_description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="product_category" label="Category">
            <Input />
          </Form.Item>

          <Form.Item name="image_url" label="Image URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
