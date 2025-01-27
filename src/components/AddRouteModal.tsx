"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTranslation } from "../context/TranslationContext";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoute: (event: {
    title: string;
    start: Date;
    end: Date;
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => void;
  defaultDate: Date;
}

export default function AddRouteModal({
  isOpen,
  onClose,
  onAddRoute,
  defaultDate,
}: AddRouteModalProps) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState(defaultDate.toISOString().split("T")[0]);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    setDate(defaultDate.toISOString().split("T")[0]);
  }, [defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoute({
      title,
      start: new Date(`${date}T${start}`),
      end: new Date(`${date}T${end}`),
      street,
      city,
      state,
      zip,
    });
    setTitle("");
    setStart("");
    setEnd("");
    setStreet("");
    setCity("");
    setState("");
    setZip("");
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">{t("date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="start">{t("startTime")}</Label>
            <Input
              id="start"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="end">{t("endTime")}</Label>
            <Input
              id="end"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="street">{t("street")}</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="city">{t("city")}</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">{t("state")}</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="zip">{t("zip")}</Label>
            <Input
              id="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
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
