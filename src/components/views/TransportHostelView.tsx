import React, { useState } from 'react';
import {
  Bus,
  Building,
  Phone,
  Users,
  MapPin,
  Shield,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Lock,
  Edit2,
  Trash2,
  Save,
  CreditCard,
  X
} from 'lucide-react';
import { BusRoute, HostelRoom, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

interface TransportHostelViewProps {
  busRoutes: BusRoute[];
  hostels: HostelRoom[];
  onAddBusRoute?: (route: BusRoute) => void;
  onUpdateBusRoute?: (route: BusRoute) => void;
  onDeleteBusRoute?: (routeId: string) => void;
  onAddHostel?: (hostel: HostelRoom) => void;
  onUpdateHostel?: (hostel: HostelRoom) => void;
  onDeleteHostel?: (hostelId: string) => void;
  currentRole?: UserRole;
}

export const TransportHostelView: React.FC<TransportHostelViewProps> = ({
  busRoutes,
  hostels,
  onAddBusRoute,
  onUpdateBusRoute,
  onDeleteBusRoute,
  onAddHostel,
  onUpdateHostel,
  onDeleteHostel,
  currentRole = 'bursar'
}) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'hostel'>('transport');

  // RBAC Permission Check: Bursar, Finance, Admin, Principal have full access to bus and hostel services records
  const hasLogisticsAccess = [
    'super_admin',
    'pioneer',
    'principal',
    'head_teacher',
    'bursar',
    'finance'
  ].includes(currentRole);

  // Modals & Forms
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [editingBus, setEditingBus] = useState<BusRoute | null>(null);
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState<HostelRoom | null>(null);

  // Bus form state
  const [routeName, setRouteName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [departureTime, setDepartureTime] = useState('06:45 AM');
  const [stopsText, setStopsText] = useState('Central Campus, Gate 1, Phase 2, Ring Road');

  // Hostel form state
  const [blockName, setBlockName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [hostelCapacity, setHostelCapacity] = useState(4);
  const [hostelGender, setHostelGender] = useState<'Boys' | 'Girls'>('Girls');
  const [wardenName, setWardenName] = useState('');
  const [feePerTerm, setFeePerTerm] = useState(350);

  // Filters state with DropdownWithSearch
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('All');
  const [selectedHostelFilter, setSelectedHostelFilter] = useState('All');

  const filteredBusRoutes = busRoutes.filter((r) => {
    if (selectedRouteFilter === 'All') return true;
    return r.id === selectedRouteFilter;
  });

  const filteredHostels = hostels.filter((h) => {
    if (selectedHostelFilter === 'All') return true;
    return h.id === selectedHostelFilter || h.blockName === selectedHostelFilter;
  });

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLogisticsAccess) return;

    const newRoute: BusRoute = {
      id: `bus-${Date.now()}`,
      routeName,
      vehicleNo: vehicleNo || `KS-BUS-${Math.floor(10 + Math.random() * 90)}`,
      driverName,
      driverPhone: driverPhone || '+234 800 000 1111',
      capacity: Number(capacity) || 30,
      assignedStudents: 0,
      departureTime,
      stops: stopsText.split(',').map((s) => s.trim())
    };

    if (onAddBusRoute) onAddBusRoute(newRoute);
    setShowAddBusModal(false);
    setRouteName('');
    setDriverName('');
  };

  const handleSaveBusEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLogisticsAccess || !editingBus) return;
    if (onUpdateBusRoute) onUpdateBusRoute(editingBus);
    setEditingBus(null);
  };

  const handleDeleteBus = (id: string) => {
    if (!hasLogisticsAccess) return;
    if (window.confirm('Delete this bus route record?')) {
      if (onDeleteBusRoute) onDeleteBusRoute(id);
    }
  };

  const handleCreateHostel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLogisticsAccess) return;

    const newHostel: HostelRoom = {
      id: `hostel-${Date.now()}`,
      blockName,
      roomNo: roomNumber || `RM-${Math.floor(100 + Math.random() * 900)}`,
      capacity: Number(hostelCapacity) || 4,
      occupantsCount: 0,
      gender: hostelGender,
      wardenName: wardenName || 'Mrs. Angela Okonkwo',
      feePerTerm: Number(feePerTerm) || 350
    };

    if (onAddHostel) onAddHostel(newHostel);
    setShowAddHostelModal(false);
    setBlockName('');
    setRoomNumber('');
  };

  const handleSaveHostelEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLogisticsAccess || !editingHostel) return;
    if (onUpdateHostel) onUpdateHostel(editingHostel);
    setEditingHostel(null);
  };

  const handleDeleteHostel = (id: string) => {
    if (!hasLogisticsAccess) return;
    if (window.confirm('Delete this hostel room record?')) {
      if (onDeleteHostel) onDeleteHostel(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        hasLogisticsAccess
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {hasLogisticsAccess ? (
            <>
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Bursary & Logistics Management Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with full access to create, update, and delete bus transport & boarding hostel records.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Read-Only Mode:</strong> Full management of bus and hostel services records is assigned to <strong>Bursar, Finance, and Administrators</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          Role: {currentRole}
        </span>
      </div>

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Bus className="h-3.5 w-3.5 text-blue-600" /> Logistics, Transport & Boarding Facilities
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            School Bus Services & Boarding Hostels
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage student transport routes, vehicle allocations, and boarding house room occupancy.
          </p>
        </div>

        {/* Tab Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('transport')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'transport'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Bus className="h-4 w-4" /> Bus Routes ({busRoutes.length})
            </button>
            <button
              onClick={() => setActiveTab('hostel')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'hostel'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Building className="h-4 w-4" /> Boarding Hostels ({hostels.length})
            </button>
          </div>

          {hasLogisticsAccess && activeTab === 'transport' && (
            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Bus Route
            </button>
          )}

          {hasLogisticsAccess && activeTab === 'hostel' && (
            <button
              onClick={() => setShowAddHostelModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Hostel Room
            </button>
          )}
        </div>
      </div>

      {/* Transport Tab Content */}
      {activeTab === 'transport' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Filter Bus Route:</span>
              <DropdownWithSearch
                options={[
                  { value: 'All', label: 'All Bus Routes' },
                  ...busRoutes.map((r) => ({
                    value: r.id,
                    label: `${r.routeName} (${r.vehicleNo})`,
                    sublabel: `Driver: ${r.driverName} • ${r.stops.join(', ')}`,
                    badge: `${r.assignedStudents}/${r.capacity} seats`
                  }))
                ]}
                value={selectedRouteFilter}
                onChange={(val) => setSelectedRouteFilter(val)}
                placeholder="Select bus route..."
                searchPlaceholder="Search route name, driver, or vehicle..."
                colorScheme="blue"
                buttonLabel="Search Route"
              />
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Showing <strong>{filteredBusRoutes.length}</strong> of {busRoutes.length} routes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredBusRoutes.map((route) => {
              const occupancyPct = Math.round((route.assignedStudents / route.capacity) * 100);
              return (
                <div
                  key={route.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 font-mono">
                        {route.vehicleNo}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-blue-600" /> {route.departureTime}
                        </span>
                        {hasLogisticsAccess && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingBus(route)}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                              title="Edit Route"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBus(route.id)}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                              title="Delete Route"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {route.routeName}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Driver: <strong>{route.driverName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">Phone: {route.driverPhone}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Route Bus Stops:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {route.stops.map((stop, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                          >
                            • {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-500">Occupancy</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {route.assignedStudents} / {route.capacity} seats ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          occupancyPct >= 90 ? 'bg-rose-500' : occupancyPct >= 70 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hostel Tab Content */}
      {activeTab === 'hostel' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Filter Hostel Room:</span>
              <DropdownWithSearch
                options={[
                  { value: 'All', label: 'All Hostel Blocks' },
                  ...hostels.map((h) => ({
                    value: h.id,
                    label: `${h.blockName} - Room ${h.roomNo}`,
                    sublabel: `Warden: ${h.wardenName} • Gender: ${h.gender}`,
                    badge: `${h.occupantsCount || 0}/${h.capacity} beds`
                  }))
                ]}
                value={selectedHostelFilter}
                onChange={(val) => setSelectedHostelFilter(val)}
                placeholder="Select hostel room..."
                searchPlaceholder="Search block, room number, or warden..."
                colorScheme="purple"
                buttonLabel="Search Hostel"
              />
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Showing <strong>{filteredHostels.length}</strong> of {hostels.length} rooms
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredHostels.map((room) => {
            const isFull = (room.occupantsCount || 0) >= room.capacity;
            const availableBeds = room.capacity - (room.occupantsCount || 0);
            return (
              <div
                key={room.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-purple-500 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      room.gender === 'Girls'
                        ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900'
                    }`}>
                      {room.gender} Wing
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isFull
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isFull ? 'Full Capacity' : `${availableBeds} Space Available`}
                      </span>
                      {hasLogisticsAccess && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingHostel(room)}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                            title="Edit Room"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHostel(room.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                            title="Delete Room"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {room.blockName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Room No: {room.roomNo}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                      <span>Hostel Warden: <strong>{room.wardenName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">Fee: ${room.feePerTerm} / term</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Bed Occupancy</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {room.occupantsCount || 0} / {room.capacity} Residents
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(Math.round(((room.occupantsCount || 0) / room.capacity) * 100), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* Add Bus Modal */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bus className="h-4 w-4 text-blue-600" /> Add New Bus Route
              </h3>
              <button onClick={() => setShowAddBusModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Route 4 - Airport Road Express"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Vehicle Plate No</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="KS-BUS-05"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Capacity (Seats)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 30)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Mr. Usman Bello"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+234 800 000 1111"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Departure Time</label>
                <input
                  type="text"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  placeholder="06:45 AM"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Stops (Comma separated)</label>
                <input
                  type="text"
                  value={stopsText}
                  onChange={(e) => setStopsText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Bus Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bus Modal */}
      {editingBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Bus Route ({editingBus.vehicleNo})
              </h3>
              <button onClick={() => setEditingBus(null)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBusEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  value={editingBus.routeName}
                  onChange={(e) => setEditingBus({ ...editingBus, routeName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={editingBus.driverName}
                    onChange={(e) => setEditingBus({ ...editingBus, driverName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={editingBus.driverPhone}
                    onChange={(e) => setEditingBus({ ...editingBus, driverPhone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Capacity</label>
                  <input
                    type="number"
                    value={editingBus.capacity}
                    onChange={(e) => setEditingBus({ ...editingBus, capacity: parseInt(e.target.value) || 30 })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Enrolled Students</label>
                  <input
                    type="number"
                    value={editingBus.assignedStudents}
                    onChange={(e) => setEditingBus({ ...editingBus, assignedStudents: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBus(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Hostel Modal */}
      {showAddHostelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-600" /> Add Hostel Room Allocation
              </h3>
              <button onClick={() => setShowAddHostelModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHostel} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Block / Hall Name</label>
                <input
                  type="text"
                  required
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="e.g. Queen Amina Hall"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="Room 102"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Wing Gender</label>
                  <DropdownWithSearch
                    options={[
                      { value: 'Female', label: 'Female Wing', badge: 'Female' },
                      { value: 'Male', label: 'Male Wing', badge: 'Male' }
                    ]}
                    value={hostelGender}
                    onChange={(val) => setHostelGender(val as any)}
                    placeholder="Select gender wing..."
                    searchPlaceholder="Search gender wing..."
                    colorScheme="purple"
                    buttonLabel="Select"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Warden Name</label>
                  <input
                    type="text"
                    value={wardenName}
                    onChange={(e) => setWardenName(e.target.value)}
                    placeholder="Mrs. Angela Okonkwo"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    value={hostelCapacity}
                    onChange={(e) => setHostelCapacity(parseInt(e.target.value) || 4)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddHostelModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save Hostel Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hostel Modal */}
      {editingHostel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-purple-600" /> Edit Room ({editingHostel.blockName} - {editingHostel.roomNo})
              </h3>
              <button onClick={() => setEditingHostel(null)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHostelEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Block Name</label>
                <input
                  type="text"
                  required
                  value={editingHostel.blockName}
                  onChange={(e) => setEditingHostel({ ...editingHostel, blockName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    value={editingHostel.capacity}
                    onChange={(e) => setEditingHostel({ ...editingHostel, capacity: parseInt(e.target.value) || 4 })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fee Per Term ($)</label>
                  <input
                    type="number"
                    value={editingHostel.feePerTerm || 350}
                    onChange={(e) => setEditingHostel({ ...editingHostel, feePerTerm: parseInt(e.target.value) || 350 })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Warden Name</label>
                <input
                  type="text"
                  value={editingHostel.wardenName}
                  onChange={(e) => setEditingHostel({ ...editingHostel, wardenName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingHostel(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
