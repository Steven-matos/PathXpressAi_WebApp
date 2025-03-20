"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/context/TranslationContext";
import type { CalendarEvent } from "@/types/calendar";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoute: (event: Omit<CalendarEvent, 'id' | 'address' | 'date'>) => void;
  defaultDate: Date;
}

export default function AddRouteModal({
  isOpen,
  onClose,
  onAddRoute,
  defaultDate,
}: AddRouteModalProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    date: defaultDate.toISOString().split("T")[0],
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: defaultDate.toISOString().split("T")[0]
    }));
  }, [defaultDate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddRoute({
      title: formData.title,
      start: new Date(`${formData.date}T${formData.start}`),
      end: new Date(`${formData.date}T${formData.end}`),
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    });
    
    setFormData({
      title: "",
      start: "",
      end: "",
      date: defaultDate.toISOString().split("T")[0],
      street: "",
      city: "",
      state: "",
      zip: "",
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addRoute")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">{t("date")}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="start">{t("startTime")}</Label>
            <Input
              id="start"
              type="time"
              value={formData.start}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="end">{t("endTime")}</Label>
            <Input
              id="end"
              type="time"
              value={formData.end}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="street">{t("street")}</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">{t("city")}</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">{t("state")}</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="zip">{t("zip")}</Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">{t("addRoute")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
