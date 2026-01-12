"use client";

import { useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function TfInitializer() {
  useEffect(() => {
    tf.env().set("DEBUG", false);
    tf.enableProdMode();

    tf.setBackend("webgl").then(() => {
      console.log("✅ TF backend:", tf.getBackend());
    });
  }, []);

  return null;
}
