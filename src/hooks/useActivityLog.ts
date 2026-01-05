import { useCallback } from "react";
import { useAppDispatch } from "@/state/redux";
import { addLog, ActivityType } from "@/state/activityLog";

export const useActivityLog = () => {
  const dispatch = useAppDispatch();

  const logActivity = useCallback(
    (
      type: ActivityType,
      message: string,
      entityType: "property" | "application" | "lease" | "user" | "system" = "system",
      entityId?: number | string
    ) => {
      dispatch(
        addLog({
          type,
          message,
          entityType,
          entityId,
        })
      );
    },
    [dispatch]
  );

  const logPropertyCreated = useCallback(
    (propertyName: string, propertyId?: number) => {
      logActivity("created", `Property "${propertyName}" was created`, "property", propertyId);
    },
    [logActivity]
  );

  const logPropertyUpdated = useCallback(
    (propertyName: string, propertyId?: number) => {
      logActivity("updated", `Property "${propertyName}" was updated`, "property", propertyId);
    },
    [logActivity]
  );

  const logPropertyDeleted = useCallback(
    (propertyName: string, propertyId?: number) => {
      logActivity("deleted", `Property "${propertyName}" was deleted`, "property", propertyId);
    },
    [logActivity]
  );

  const logPropertyVisibilityChanged = useCallback(
    (propertyName: string, isHidden: boolean, propertyId?: number) => {
      logActivity(
        "visibility_changed",
        `Property "${propertyName}" is now ${isHidden ? "hidden" : "visible"}`,
        "property",
        propertyId
      );
    },
    [logActivity]
  );

  const logApplicationCreated = useCallback(
    (propertyName: string, applicationId?: number) => {
      logActivity(
        "created",
        `New application submitted for "${propertyName}"`,
        "application",
        applicationId
      );
    },
    [logActivity]
  );

  const logApplicationStatusChanged = useCallback(
    (status: string, applicationId?: number) => {
      logActivity(
        "updated",
        `Application status changed to "${status}"`,
        "application",
        applicationId
      );
    },
    [logActivity]
  );

  const logError = useCallback(
    (message: string) => {
      logActivity("error", message, "system");
    },
    [logActivity]
  );

  const logInfo = useCallback(
    (message: string) => {
      logActivity("info", message, "system");
    },
    [logActivity]
  );

  return {
    logActivity,
    logPropertyCreated,
    logPropertyUpdated,
    logPropertyDeleted,
    logPropertyVisibilityChanged,
    logApplicationCreated,
    logApplicationStatusChanged,
    logError,
    logInfo,
  };
};
